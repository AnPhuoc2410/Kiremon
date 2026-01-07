using System.Collections.Generic;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IPresenceTracker
    {
        Task<bool> UserConnected(string userId, string connectionId);
        Task<bool> UserDisconnected(string userId, string connectionId);
        Task<string[]> GetOnlineUsers();
        Task<List<string>> GetConnectionsForUser(string userId);
        Task<bool> IsUserOnline(string userId);
    }
}
