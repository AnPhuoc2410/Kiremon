namespace PokedexReactASP.Server.Options;

/// <summary>
/// Strongly-typed configuration options for OpenTelemetry observability integration.
/// Bound from the "OpenTelemetry" section in appsettings.json or environment variables.
/// </summary>
public sealed class OpenTelemetryOptions
{
    public const string SectionName = "OpenTelemetry";
    public string OtlpEndpoint { get; init; } = "http://localhost:4317";
    public string ServiceName { get; init; } = "kiremon_api";
    public string ServiceVersion { get; init; } =
        typeof(OpenTelemetryOptions).Assembly.GetName().Version?.ToString() ?? "1.0.0";
    public bool Enabled { get; init; } = true;
}
