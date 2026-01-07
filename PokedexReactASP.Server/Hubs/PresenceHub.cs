using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PokedexReactASP.Application.Interfaces;
using System.Security.Claims;

namespace PokedexReactASP.Server.Hubs
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly IPresenceTracker _tracker;
        private readonly IFriendService _friendService;

        public PresenceHub(IPresenceTracker tracker, IFriendService friendService)
        {
            _tracker = tracker;
            _friendService = friendService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (userId != null)
            {
                var isOnline = await _tracker.UserConnected(userId, Context.ConnectionId);
                if (isOnline)
                {
                    // Notify friends that user is online
                    var friendIds = await _friendService.GetFriendIdsAsync(userId);

                    if (friendIds != null && friendIds.Any())
                    {
                        await Clients.Users(friendIds).SendAsync("UserIsOnline", userId);
                    }
                }

                // Send current online friends to the connecting user
                var currentUsers = await _tracker.GetOnlineUsers();
                
                // Filter to only my friends
                //var myFriends = await _friendService.GetFriendsAsync(userId);
                //var onlineFriendIds = myFriends
                //    .Where(f => currentUsers.Contains(f.UserId))
                //    .Select(f => f.UserId)
                //    .ToArray();
                
                //if (onlineFriendIds.Any())
                //{
                //    await Clients.Caller.SendAsync("GetOnlineFriends", onlineFriendIds);
                //}d
            }

            await base.OnConnectedAsync();
        }

        public async Task<string[]> GetOnlineFriendsList()
        {
            var userId = Context.User?.FindFirst("NameIdentifier")?.Value;
            var friendIds = await _friendService.GetFriendIdsAsync(userId);
            var onlineUsers = await _tracker.GetOnlineUsers();

            return onlineUsers.Intersect(friendIds).ToArray();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != null)
            {
                var isOffline = await _tracker.UserDisconnected(userId, Context.ConnectionId);
                if (isOffline)
                {
                    var friendIds = await _friendService.GetFriendIdsAsync(userId);
                    if (friendIds != null && friendIds.Any())
                    {
                        await Clients.Users(friendIds).SendAsync("UserIsOffline", userId);
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
