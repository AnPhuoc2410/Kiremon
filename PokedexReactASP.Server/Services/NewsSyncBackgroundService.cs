using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Server.Services
{
    public class NewsSyncBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NewsSyncBackgroundService> _logger;

        public NewsSyncBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<NewsSyncBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("NewsSyncBackgroundService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                var delay = GetDelayUntilNext7Am();
                _logger.LogInformation("Next automated news synchronization scheduled at 7:00 AM (ICT) in {Delay}", delay);
                
                try
                {
                    await Task.Delay(delay, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }

                try
                {
                    _logger.LogInformation("Automated news synchronization task starting...");

                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var syncService = scope.ServiceProvider.GetRequiredService<IPokemonNewsSyncService>();
                        var result = await syncService.SyncNewsAsync(stoppingToken);

                        _logger.LogInformation(
                            "Automated news synchronization task completed: Scraped={TotalScraped}, Inserted={Inserted}, Updated={Updated}, Failed={Failed}",
                            result.TotalScraped, result.Inserted, result.Updated, result.Failed);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred during automated news synchronization.");
                }
            }

            _logger.LogInformation("NewsSyncBackgroundService is stopping.");
        }

        private static TimeSpan GetDelayUntilNext7Am()
        {
            var nowUtc = DateTimeOffset.UtcNow;
            // Vietnam Time (ICT) is UTC+7 with no DST
            var offset = TimeSpan.FromHours(7);
            var nowLocal = nowUtc.ToOffset(offset);
            
            // Calculate next 7:00 AM local time
            var targetLocal = new DateTimeOffset(nowLocal.Year, nowLocal.Month, nowLocal.Day, 7, 0, 0, offset);
            
            if (nowLocal >= targetLocal)
            {
                targetLocal = targetLocal.AddDays(1);
            }
            
            return targetLocal - nowLocal;
        }
    }
}
