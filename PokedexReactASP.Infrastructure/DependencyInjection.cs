using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Get connection strings
            var defaultConnection = configuration.GetConnectionString("DefaultConnection");
            var localConnection = configuration.GetConnectionString("LocalConnection");

            services.AddDbContext<PokemonDbContext>(options =>
            {
                try
                {
                    // Try to use the default (public) connection first
                    options.UseMySql(defaultConnection,
                        ServerVersion.AutoDetect(defaultConnection),
                        mysqlOptions =>
                        {
                            mysqlOptions.EnableRetryOnFailure(
                                maxRetryCount: 3,
                                maxRetryDelay: TimeSpan.FromSeconds(10),
                                errorNumbersToAdd: null);

                            // Add command timeout for public connections
                            mysqlOptions.CommandTimeout(30);
                        });
                }
                catch (Exception ex)
                {
                    // If public connection fails and local connection is available, try local
                    if (!string.IsNullOrEmpty(localConnection))
                    {
                        Console.WriteLine($"Public connection failed, trying local: {ex.Message}");
                        options.UseMySql(localConnection,
                            ServerVersion.AutoDetect(localConnection),
                            mysqlOptions =>
                            {
                                mysqlOptions.EnableRetryOnFailure(
                                    maxRetryCount: 3,
                                    maxRetryDelay: TimeSpan.FromSeconds(5),
                                    errorNumbersToAdd: null);
                            });
                    }
                    else
                    {
                        throw;
                    }
                }
            });

            return services;
        }
    }
}