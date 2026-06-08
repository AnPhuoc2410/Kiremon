using System.Threading.Tasks;
using PokedexReactASP.Application.DTOs.Achievement;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Service interface for pushing real-time achievement notifications to clients.
    /// </summary>
    public interface IAchievementNotificationService
    {
        /// <summary>
        /// Pushes a real-time achievement unlock notification to a specific user.
        /// </summary>
        Task NotifyAchievementUnlockedAsync(string userId, AchievementNotificationDto notification);
    }
}
