using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace PokedexReactASP.Server.Hubs
{
    [Authorize]
    public class PokemonHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var username = Context.User?.Identity?.Name ?? "Anonymous";
            await Clients.All.SendAsync("UserConnected", username);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var username = Context.User?.Identity?.Name ?? "Anonymous";
            await Clients.All.SendAsync("UserDisconnected", username);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendPokemonCaught(string pokemonName, string username)
        {
            await Clients.All.SendAsync("PokemonCaught", new
            {
                pokemonName,
                username,
                timestamp = DateTime.UtcNow
            });
        }

        public async Task SendPokemonReleased(string pokemonName, string username)
        {
            await Clients.All.SendAsync("PokemonReleased", new
            {
                pokemonName,
                username,
                timestamp = DateTime.UtcNow
            });
        }

        public async Task NotifyLevelUp(string username, int newLevel)
        {
            await Clients.All.SendAsync("UserLevelUp", new
            {
                username,
                newLevel,
                timestamp = DateTime.UtcNow
            });
        }

        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("UserJoinedGroup", Context.User?.Identity?.Name);
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("UserLeftGroup", Context.User?.Identity?.Name);
        }
    }
}
