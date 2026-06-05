using Microsoft.AspNetCore.SignalR;
using PokedexReactASP.Application.DTOs.Achievement;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Server.Hubs;
using System.Threading.Tasks;

namespace PokedexReactASP.Server.Services
{
    /// <summary>
    /// Pushes real-time achievement notifications using SignalR PresenceHub.
    /// </summary>
    public class AchievementNotificationService : IAchievementNotificationService
    {
        private readonly IHubContext<PresenceHub> _hubContext;

        public AchievementNotificationService(IHubContext<PresenceHub> hubContext)
        {
            _hubContext = hubContext;
        }

        /// <inheritdoc/>
        public async Task NotifyAchievementUnlockedAsync(string userId, AchievementNotificationDto notification)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveAchievementUnlocked", notification);
        }
    }
}
