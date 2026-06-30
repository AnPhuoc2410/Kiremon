
using OpenTelemetry.Exporter;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using PokedexReactASP.Server.Options;

namespace PokedexReactASP.Server.Extensions;

/// <summary>
/// Extension methods that wire up the full OpenTelemetry observability pipeline
/// (Traces → Tempo, Metrics → Prometheus, Logs → Loki) via a single Alloy OTLP endpoint.
/// </summary>
public static class OpenTelemetryExtensions
{
    /// <summary>
    /// Registers OpenTelemetry tracing, metrics and logging for the Kiremon API.
    /// </summary>
    /// <param name="services">The application service collection.</param>
    /// <param name="configuration">The host configuration (appsettings + env vars).</param>
    /// <returns>The same <see cref="IServiceCollection"/> for fluent chaining.</returns>
    public static IServiceCollection AddKiremonObservability(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var otelOptions = configuration
            .GetSection(OpenTelemetryOptions.SectionName)
            .Get<OpenTelemetryOptions>() ?? new OpenTelemetryOptions();

        // Register as strongly-typed IOptions<T> so other services can inject it.
        services.Configure<OpenTelemetryOptions>(
            configuration.GetSection(OpenTelemetryOptions.SectionName));

        if (!otelOptions.Enabled)
            return services;

        // Build the shared resource that identifies this service in every signal.
        var resourceBuilder = ResourceBuilder.CreateDefault()
            .AddService(
                serviceName: otelOptions.ServiceName,
                serviceVersion: otelOptions.ServiceVersion)
            .AddAttributes(new[]
            {
                new KeyValuePair<string, object>("deployment.environment",
                    configuration["DOTNET_ENVIRONMENT"] ?? "Production"),
            });

        services
            .AddOpenTelemetry()
            .WithTracing(tracing => ConfigureTracing(tracing, resourceBuilder, otelOptions))
            .WithMetrics(metrics => ConfigureMetrics(metrics, resourceBuilder, otelOptions));

        // OTel logging bridge — funnels Serilog's ILogger output through OTel pipeline to Loki.
        services.AddLogging(logging =>
        {
            logging.AddOpenTelemetry(otelLogging =>
            {
                otelLogging.SetResourceBuilder(resourceBuilder);
                otelLogging.IncludeFormattedMessage = true;
                otelLogging.IncludeScopes = true;
                otelLogging.ParseStateValues = true;
                otelLogging.AddOtlpExporter(ConfigureOtlpExporter(otelOptions));
            });
        });

        return services;
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /// <summary>Configures distributed tracing with all relevant instrumentations.</summary>
    private static void ConfigureTracing(
        TracerProviderBuilder tracing,
        ResourceBuilder resourceBuilder,
        OpenTelemetryOptions options)
    {
        tracing
            .SetResourceBuilder(resourceBuilder)
            // ASP.NET Core request tracing (HTTP server spans)
            .AddAspNetCoreInstrumentation(aspnet =>
            {
                // Exclude noisy health-check and metrics endpoints from traces.
                aspnet.Filter = httpContext =>
                {
                    var path = httpContext.Request.Path.Value ?? string.Empty;
                    return !path.StartsWith("/health", StringComparison.OrdinalIgnoreCase)
                        && !path.StartsWith("/metrics", StringComparison.OrdinalIgnoreCase)
                        && !path.StartsWith("/version", StringComparison.OrdinalIgnoreCase);
                };

                // Capture 4xx/5xx response bodies for easier debugging.
                aspnet.RecordException = true;
            })
            // Outgoing HttpClient spans (PokeAPI, PokemonTCG, reCAPTCHA, etc.)
            .AddHttpClientInstrumentation(http =>
            {
                // Skip telemetry calls to avoid feedback loops.
                http.FilterHttpRequestMessage = req =>
                    req.RequestUri?.Host?.Contains("localhost", StringComparison.OrdinalIgnoreCase) == false
                    || req.RequestUri?.Port != 4317;
            })
            // Entity Framework Core query spans (PostgreSQL via Npgsql)
            .AddEntityFrameworkCoreInstrumentation(ef =>
            {
                // Capture parameterized SQL statements for query analysis.
                ef.SetDbStatementForText = true;
                ef.SetDbStatementForStoredProcedure = true;
            })
            // OTLP export to Alloy (→ Tempo)
            .AddOtlpExporter(ConfigureOtlpExporter(options));
    }

    /// <summary>Configures metrics with ASP.NET Core and HTTP Client instrumentations.</summary>
    private static void ConfigureMetrics(
        MeterProviderBuilder metrics,
        ResourceBuilder resourceBuilder,
        OpenTelemetryOptions options)
    {
        metrics
            .SetResourceBuilder(resourceBuilder)
            // ASP.NET Core HTTP server metrics (legacy & modern)
            .AddAspNetCoreInstrumentation()
            // HttpClient metrics (request count, duration per host)
            .AddHttpClientInstrumentation()
            // Runtime metrics (.NET GC, thread pool, etc.)
            .AddRuntimeInstrumentation()
            // Process metrics (CPU, Memory)
            .AddProcessInstrumentation()
            // Built-in .NET 8 meters that Grafana dashboards typically expect
            .AddMeter(
                "Microsoft.AspNetCore.Hosting",
                "Microsoft.AspNetCore.Server.Kestrel",
                "Microsoft.AspNetCore.Http.Connections",
                "Microsoft.AspNetCore.Routing",
                "Microsoft.AspNetCore.Diagnostics",
                "Microsoft.AspNetCore.RateLimiting",
                "System.Net.Http",
                "System.Net.NameResolution"
            )
            // OTLP export to Alloy (→ Prometheus via remote_write)
            .AddOtlpExporter(ConfigureOtlpExporter(options));
    }

    /// <summary>
    /// Builds a reusable OTLP exporter configuration action targeting the
    /// gRPC endpoint defined in <see cref="OpenTelemetryOptions"/>.
    /// </summary>
    private static Action<OtlpExporterOptions> ConfigureOtlpExporter(OpenTelemetryOptions options)
    {
        return otlp =>
        {
            otlp.Endpoint = new Uri(options.OtlpEndpoint);
            otlp.Protocol = OtlpExportProtocol.Grpc;
        };
    }
}
