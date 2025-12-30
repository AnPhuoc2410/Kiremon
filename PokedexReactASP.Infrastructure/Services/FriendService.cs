using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.DTOs.Friend;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    /// <summary>
    /// Service for managing friend relationships
    /// </summary>
    public class FriendService : IFriendService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly PokemonDbContext _context;

        public FriendService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            PokemonDbContext context)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _context = context;
        }

        #region Friend Code & QR

        public async Task<FriendCodeDto> GetMyFriendCodeAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            return new FriendCodeDto
            {
                FriendCode = user.FriendCode,
                Username = user.UserName ?? string.Empty,
                TrainerLevel = user.TrainerLevel,
                QrCodeData = GenerateQrCodeData(user.FriendCode)
            };
        }

        public async Task<FriendCodeDto> RegenerateFriendCodeAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            // Generate new unique friend code
            string newCode;
            do
            {
                newCode = GenerateFriendCode();
            } while (await _context.Users.AnyAsync(u => u.FriendCode == newCode));

            user.FriendCode = newCode;
            await _userManager.UpdateAsync(user);

            return new FriendCodeDto
            {
                FriendCode = user.FriendCode,
                Username = user.UserName ?? string.Empty,
                TrainerLevel = user.TrainerLevel,
                QrCodeData = GenerateQrCodeData(user.FriendCode)
            };
        }

        private static string GenerateFriendCode()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            var random = new Random();
            var code = new char[12];
            for (int i = 0; i < 12; i++)
            {
                code[i] = chars[random.Next(chars.Length)];
            }
            return $"{new string(code, 0, 4)}-{new string(code, 4, 4)}-{new string(code, 8, 4)}";
        }

        private static string GenerateQrCodeData(string friendCode)
        {
            // Return the friend code as QR data - frontend will generate the actual QR image
            return $"pokemon-friend:{friendCode}";
        }

        #endregion

        #region Friend Requests

        public async Task<FriendOperationResultDto> SendFriendRequestAsync(string userId, SendFriendRequestDto request)
        {
            // Normalize friend code
            var normalizedCode = request.FriendCode.ToUpper().Replace(" ", "");
            
            // Find user by friend code
            var targetUser = await _context.Users
                .FirstOrDefaultAsync(u => u.FriendCode == normalizedCode);

            if (targetUser == null)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "Friend code not found. Please check and try again."
                };
            }

            // Can't add yourself
            if (targetUser.Id == userId)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "You cannot add yourself as a friend."
                };
            }

            // Check if target allows friend requests
            if (!targetUser.AllowFriendRequests)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "This trainer is not accepting friend requests."
                };
            }

            // Check if already friends
            if (await AreFriendsAsync(userId, targetUser.Id))
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "You are already friends with this trainer."
                };
            }

            // Check for existing pending request
            var existingRequest = await _unitOfWork.FriendRequest.FirstOrDefaultAsync(
                fr => ((fr.SenderId == userId && fr.ReceiverId == targetUser.Id) ||
                       (fr.SenderId == targetUser.Id && fr.ReceiverId == userId)) &&
                      fr.Status == FriendRequestStatus.Pending);

            if (existingRequest != null)
            {
                if (existingRequest.SenderId == userId)
                {
                    return new FriendOperationResultDto
                    {
                        Success = false,
                        Message = "You already have a pending request to this trainer."
                    };
                }
                else
                {
                    // Auto-accept if there's a pending request from the other user
                    return await AcceptFriendRequestAsync(userId, existingRequest.Id);
                }
            }

            // Create new friend request
            var friendRequest = new FriendRequest
            {
                SenderId = userId,
                ReceiverId = targetUser.Id,
                Message = request.Message,
                SentAt = DateTime.UtcNow,
                Status = FriendRequestStatus.Pending
            };

            await _unitOfWork.FriendRequest.AddAsync(friendRequest);
            await _unitOfWork.SaveChangesAsync();

            return new FriendOperationResultDto
            {
                Success = true,
                Message = $"Friend request sent to {targetUser.UserName}!"
            };
        }

        public async Task<IEnumerable<FriendRequestDto>> GetReceivedFriendRequestsAsync(string userId)
        {
            var requests = await _context.FriendRequests
                .Include(fr => fr.Sender)
                .Where(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending)
                .OrderByDescending(fr => fr.SentAt)
                .ToListAsync();

            return requests.Select(fr => new FriendRequestDto
            {
                RequestId = fr.Id,
                UserId = fr.SenderId,
                Username = fr.Sender.UserName ?? string.Empty,
                AvatarUrl = fr.Sender.AvatarUrl,
                TrainerLevel = fr.Sender.TrainerLevel,
                Message = fr.Message,
                SentAt = fr.SentAt,
                Status = fr.Status,
                IsSentByMe = false
            });
        }

        public async Task<IEnumerable<FriendRequestDto>> GetSentFriendRequestsAsync(string userId)
        {
            var requests = await _context.FriendRequests
                .Include(fr => fr.Receiver)
                .Where(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending)
                .OrderByDescending(fr => fr.SentAt)
                .ToListAsync();

            return requests.Select(fr => new FriendRequestDto
            {
                RequestId = fr.Id,
                UserId = fr.ReceiverId,
                Username = fr.Receiver.UserName ?? string.Empty,
                AvatarUrl = fr.Receiver.AvatarUrl,
                TrainerLevel = fr.Receiver.TrainerLevel,
                Message = fr.Message,
                SentAt = fr.SentAt,
                Status = fr.Status,
                IsSentByMe = true
            });
        }

        public async Task<FriendOperationResultDto> AcceptFriendRequestAsync(string userId, int requestId)
        {
            var request = await _context.FriendRequests
                .Include(fr => fr.Sender)
                .FirstOrDefaultAsync(fr => fr.Id == requestId && fr.ReceiverId == userId);

            if (request == null)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "Friend request not found."
                };
            }

            if (request.Status != FriendRequestStatus.Pending)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "This request has already been processed."
                };
            }

            // Update request status
            request.Status = FriendRequestStatus.Accepted;
            request.RespondedAt = DateTime.UtcNow;

            // Create friendship (ensure User1Id < User2Id for consistency)
            string user1Id, user2Id;
            if (string.Compare(userId, request.SenderId) < 0)
            {
                user1Id = userId;
                user2Id = request.SenderId;
            }
            else
            {
                user1Id = request.SenderId;
                user2Id = userId;
            }

            var friendship = new Friendship
            {
                User1Id = user1Id,
                User2Id = user2Id,
                FriendsSince = DateTime.UtcNow
            };

            await _unitOfWork.Friendship.AddAsync(friendship);

            // Update friends count for both users
            var currentUser = await _userManager.FindByIdAsync(userId);
            var otherUser = await _userManager.FindByIdAsync(request.SenderId);
            
            if (currentUser != null) currentUser.FriendsCount++;
            if (otherUser != null) otherUser.FriendsCount++;

            await _unitOfWork.SaveChangesAsync();

            var friendDto = await CreateFriendDto(userId, request.SenderId, friendship);

            return new FriendOperationResultDto
            {
                Success = true,
                Message = $"You are now friends with {request.Sender.UserName}!",
                NewFriend = friendDto
            };
        }

        public async Task<FriendOperationResultDto> DeclineFriendRequestAsync(string userId, int requestId)
        {
            var request = await _unitOfWork.FriendRequest.FirstOrDefaultAsync(
                fr => fr.Id == requestId && fr.ReceiverId == userId);

            if (request == null)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "Friend request not found."
                };
            }

            if (request.Status != FriendRequestStatus.Pending)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "This request has already been processed."
                };
            }

            request.Status = FriendRequestStatus.Declined;
            request.RespondedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();

            return new FriendOperationResultDto
            {
                Success = true,
                Message = "Friend request declined."
            };
        }

        public async Task<FriendOperationResultDto> CancelFriendRequestAsync(string userId, int requestId)
        {
            var request = await _unitOfWork.FriendRequest.FirstOrDefaultAsync(
                fr => fr.Id == requestId && fr.SenderId == userId);

            if (request == null)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "Friend request not found."
                };
            }

            if (request.Status != FriendRequestStatus.Pending)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "This request has already been processed."
                };
            }

            request.Status = FriendRequestStatus.Cancelled;
            request.RespondedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();

            return new FriendOperationResultDto
            {
                Success = true,
                Message = "Friend request cancelled."
            };
        }

        #endregion

        #region Friends List

        public async Task<IEnumerable<FriendDto>> GetFriendsAsync(string userId)
        {
            var friendships = await _context.Friendships
                .Include(f => f.User1)
                .Include(f => f.User2)
                .Where(f => f.User1Id == userId || f.User2Id == userId)
                .ToListAsync();

            var friends = new List<FriendDto>();
            var onlineThreshold = DateTime.UtcNow.AddMinutes(-15);

            foreach (var friendship in friendships)
            {
                var friend = friendship.User1Id == userId ? friendship.User2 : friendship.User1;
                var nickname = friendship.User1Id == userId
                    ? friendship.User1NicknameForUser2
                    : friendship.User2NicknameForUser1;

                friends.Add(new FriendDto
                {
                    UserId = friend.Id,
                    Username = friend.UserName ?? string.Empty,
                    AvatarUrl = friend.AvatarUrl,
                    TrainerLevel = friend.TrainerLevel,
                    FavoriteType = friend.FavoriteType,
                    FriendsSince = friendship.FriendsSince,
                    FriendshipLevel = friendship.FriendshipLevel,
                    IsOnline = friend.ShowOnlineStatus && friend.LastActiveDate > onlineThreshold,
                    LastActiveDate = friend.LastActiveDate,
                    PokemonCaught = friend.PokemonCaught,
                    TradesWithFriend = friendship.TradesCompleted,
                    BattlesWithFriend = friendship.BattlesTogether,
                    Nickname = nickname
                });
            }

            return friends.OrderByDescending(f => f.IsOnline)
                .ThenByDescending(f => f.FriendshipLevel)
                .ThenBy(f => f.Username);
        }

        public async Task<FriendsSummaryDto> GetFriendsSummaryAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var onlineThreshold = DateTime.UtcNow.AddMinutes(-15);

            var friendships = await _context.Friendships
                .Include(f => f.User1)
                .Include(f => f.User2)
                .Where(f => f.User1Id == userId || f.User2Id == userId)
                .ToListAsync();

            var onlineFriends = friendships.Count(f =>
            {
                var friend = f.User1Id == userId ? f.User2 : f.User1;
                return friend.ShowOnlineStatus && friend.LastActiveDate > onlineThreshold;
            });

            var pendingReceived = await _unitOfWork.FriendRequest.CountAsync(
                fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending);

            var pendingSent = await _unitOfWork.FriendRequest.CountAsync(
                fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending);

            return new FriendsSummaryDto
            {
                TotalFriends = friendships.Count,
                OnlineFriends = onlineFriends,
                PendingRequestsReceived = pendingReceived,
                PendingRequestsSent = pendingSent,
                MyFriendCode = user?.FriendCode ?? string.Empty
            };
        }

        public async Task<FriendOperationResultDto> RemoveFriendAsync(string userId, string friendUserId)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f =>
                    (f.User1Id == userId && f.User2Id == friendUserId) ||
                    (f.User1Id == friendUserId && f.User2Id == userId));

            if (friendship == null)
            {
                return new FriendOperationResultDto
                {
                    Success = false,
                    Message = "Friendship not found."
                };
            }

            _unitOfWork.Friendship.Remove(friendship);

            // Update friends count
            var currentUser = await _userManager.FindByIdAsync(userId);
            var otherUser = await _userManager.FindByIdAsync(friendUserId);
            
            if (currentUser != null && currentUser.FriendsCount > 0) currentUser.FriendsCount--;
            if (otherUser != null && otherUser.FriendsCount > 0) otherUser.FriendsCount--;

            await _unitOfWork.SaveChangesAsync();

            return new FriendOperationResultDto
            {
                Success = true,
                Message = "Friend removed."
            };
        }

        public async Task<bool> UpdateFriendNicknameAsync(string userId, UpdateFriendNicknameDto request)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f =>
                    (f.User1Id == userId && f.User2Id == request.FriendUserId) ||
                    (f.User1Id == request.FriendUserId && f.User2Id == userId));

            if (friendship == null) return false;

            if (friendship.User1Id == userId)
            {
                friendship.User1NicknameForUser2 = request.Nickname;
            }
            else
            {
                friendship.User2NicknameForUser1 = request.Nickname;
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Search & Discovery

        public async Task<IEnumerable<UserSearchResultDto>> SearchUsersAsync(string userId, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm) || searchTerm.Length < 3)
            {
                return Enumerable.Empty<UserSearchResultDto>();
            }

            var normalizedSearch = searchTerm.ToUpper().Replace("-", "").Replace(" ", "");

            // First get users matching username
            var users = await _context.Users
                .Where(u => u.Id != userId &&
                    u.UserName!.ToUpper().Contains(normalizedSearch))
                .Take(20)
                .ToListAsync();

            // If not enough results, also search by friend code (client-side)
            if (users.Count < 20)
            {
                var allUsers = await _context.Users
                    .Where(u => u.Id != userId)
                    .Take(100)
                    .ToListAsync();

                var additionalUsers = allUsers
                    .Where(u => u.FriendCode.Replace("-", "").Contains(normalizedSearch) &&
                                !users.Any(existing => existing.Id == u.Id))
                    .Take(20 - users.Count)
                    .ToList();

                users.AddRange(additionalUsers);
            }

            var results = new List<UserSearchResultDto>();

            foreach (var user in users)
            {
                results.Add(new UserSearchResultDto
                {
                    UserId = user.Id,
                    Username = user.UserName ?? string.Empty,
                    AvatarUrl = user.AvatarUrl,
                    TrainerLevel = user.TrainerLevel,
                    FriendCode = user.FriendCode,
                    IsFriend = await AreFriendsAsync(userId, user.Id),
                    HasPendingRequest = await HasPendingRequestAsync(userId, user.Id)
                });
            }

            return results;
        }

        public async Task<UserSearchResultDto?> FindUserByFriendCodeAsync(string userId, string friendCode)
        {
            var normalizedCode = friendCode.ToUpper().Replace(" ", "");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.FriendCode == normalizedCode && u.Id != userId);

            if (user == null) return null;

            return new UserSearchResultDto
            {
                UserId = user.Id,
                Username = user.UserName ?? string.Empty,
                AvatarUrl = user.AvatarUrl,
                TrainerLevel = user.TrainerLevel,
                FriendCode = user.FriendCode,
                IsFriend = await AreFriendsAsync(userId, user.Id),
                HasPendingRequest = await HasPendingRequestAsync(userId, user.Id)
            };
        }

        #endregion

        #region Validation

        public async Task<bool> AreFriendsAsync(string userId1, string userId2)
        {
            return await _unitOfWork.Friendship.ExistsAsync(f =>
                (f.User1Id == userId1 && f.User2Id == userId2) ||
                (f.User1Id == userId2 && f.User2Id == userId1));
        }

        public async Task<bool> HasPendingRequestAsync(string userId1, string userId2)
        {
            return await _unitOfWork.FriendRequest.ExistsAsync(fr =>
                ((fr.SenderId == userId1 && fr.ReceiverId == userId2) ||
                 (fr.SenderId == userId2 && fr.ReceiverId == userId1)) &&
                fr.Status == FriendRequestStatus.Pending);
        }

        #endregion

        #region Private Helpers

        private async Task<FriendDto> CreateFriendDto(string userId, string friendUserId, Friendship friendship)
        {
            var friend = await _userManager.FindByIdAsync(friendUserId);
            var onlineThreshold = DateTime.UtcNow.AddMinutes(-15);

            return new FriendDto
            {
                UserId = friend!.Id,
                Username = friend.UserName ?? string.Empty,
                AvatarUrl = friend.AvatarUrl,
                TrainerLevel = friend.TrainerLevel,
                FavoriteType = friend.FavoriteType,
                FriendsSince = friendship.FriendsSince,
                FriendshipLevel = friendship.FriendshipLevel,
                IsOnline = friend.ShowOnlineStatus && friend.LastActiveDate > onlineThreshold,
                LastActiveDate = friend.LastActiveDate,
                PokemonCaught = friend.PokemonCaught,
                TradesWithFriend = friendship.TradesCompleted,
                BattlesWithFriend = friendship.BattlesTogether
            };
        }

        #endregion
    }
}
