using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.Interfaces;
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

            services.AddDbContext<PokemonDbContext>(options =>
            {
                options.UseNpgsql(connectionString, npgsqlOptions =>
                {
                    npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(10), null);
                    npgsqlOptions.CommandTimeout(30);
                });
            });

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}