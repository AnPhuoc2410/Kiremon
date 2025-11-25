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
            // Get PostgreSQL connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // Add DbContext with PostgreSQL
            services.AddDbContext<PokemonDbContext>(options =>
            {
                options.UseNpgsql(connectionString,
                    npgsqlOptions =>
                    {
                        npgsqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 3,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorNumbersToAdd: null);

                        npgsqlOptions.CommandTimeout(30);
                    });
            });

            // Add Repository and UnitOfWork
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            
            // Add Token Service
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}