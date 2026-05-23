using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Infrastructure.ExternalApis;
using PokedexReactASP.Infrastructure.Persistence;
using PokedexReactASP.Infrastructure.Repositories;
using PokedexReactASP.Infrastructure.Services;

namespace PokedexReactASP.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("DefaultConnection is not configured.");
            }

            services.AddDbContextPool<PokemonDbContext>(options =>
            {
                options.UseNpgsql(connectionString, npgsqlOptions =>
                {
                    npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(10), null);
                    npgsqlOptions.CommandTimeout(180);
                });
            });

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IFriendService, FriendService>();
            services.Configure<PokemonTcgApiSettings>(configuration.GetSection(PokemonTcgApiSettings.SectionName));
            services.AddHttpClient<IPokemonTcgApiClient, PokemonTcgApiClient>((serviceProvider, client) =>
            {
                var settings = serviceProvider
                    .GetRequiredService<Microsoft.Extensions.Options.IOptions<PokemonTcgApiSettings>>()
                    .Value;

                client.BaseAddress = new Uri(settings.BaseUrl);
                client.Timeout = TimeSpan.FromSeconds(15);

                if (!string.IsNullOrWhiteSpace(settings.ApiKey))
                {
                    client.DefaultRequestHeaders.Remove("X-Api-Key");
                    client.DefaultRequestHeaders.Add("X-Api-Key", settings.ApiKey);
                }
            });
            services.AddScoped<ITcgCardService, TcgCardService>();
            services.AddScoped<ITcgCardCollectionService, TcgCardCollectionService>();

            return services;
        }
    }
}
