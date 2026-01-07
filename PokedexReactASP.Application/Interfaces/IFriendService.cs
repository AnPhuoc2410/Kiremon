using PokedexReactASP.Application.DTOs.Friend;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Service interface for friend-related operations
    /// </summary>
    public interface IFriendService
    {
        #region Friend Code & QR
        
        /// <summary>
        /// Get user's friend code and QR data
        /// </summary>
        Task<FriendCodeDto> GetMyFriendCodeAsync(string userId);
        
        /// <summary>
        /// Regenerate user's friend code (invalidates old one)
        /// </summary>
        Task<FriendCodeDto> RegenerateFriendCodeAsync(string userId);
        
        #endregion

        #region Friend Requests
        
        /// <summary>
        /// Send a friend request using friend code
        /// </summary>
        Task<FriendOperationResultDto> SendFriendRequestAsync(string userId, SendFriendRequestDto request);
        
        /// <summary>
        /// Get all pending friend requests (received)
        /// </summary>
        Task<IEnumerable<FriendRequestDto>> GetReceivedFriendRequestsAsync(string userId);
        
        /// <summary>
        /// Get all pending friend requests (sent)
        /// </summary>
        Task<IEnumerable<FriendRequestDto>> GetSentFriendRequestsAsync(string userId);
        
        /// <summary>
        /// Accept a friend request
        /// </summary>
        Task<FriendOperationResultDto> AcceptFriendRequestAsync(string userId, int requestId);
        
        /// <summary>
        /// Decline a friend request
        /// </summary>
        Task<FriendOperationResultDto> DeclineFriendRequestAsync(string userId, int requestId);
        
        /// <summary>
        /// Cancel a sent friend request
        /// </summary>
        Task<FriendOperationResultDto> CancelFriendRequestAsync(string userId, int requestId);
        
        #endregion

        #region Friends List
        
        /// <summary>
        /// Get all friends of a user
        /// </summary>
        Task<IEnumerable<FriendDto>> GetFriendsAsync(string userId);

        Task<IEnumerable<string>> GetFriendIdsAsync(string userId);
        
        /// <summary>
        /// Get friends summary (counts, online status, etc.)
        /// </summary>
        Task<FriendsSummaryDto> GetFriendsSummaryAsync(string userId);
        
        /// <summary>
        /// Remove a friend
        /// </summary>
        Task<FriendOperationResultDto> RemoveFriendAsync(string userId, string friendUserId);
        
        /// <summary>
        /// Update nickname for a friend
        /// </summary>
        Task<bool> UpdateFriendNicknameAsync(string userId, UpdateFriendNicknameDto request);
        
        #endregion

        #region Search & Discovery
        
        /// <summary>
        /// Search users by username or friend code
        /// </summary>
        Task<IEnumerable<UserSearchResultDto>> SearchUsersAsync(string userId, string searchTerm);
        
        /// <summary>
        /// Find user by friend code
        /// </summary>
        Task<UserSearchResultDto?> FindUserByFriendCodeAsync(string userId, string friendCode);
        
        #endregion

        #region Validation
        
        /// <summary>
        /// Check if two users are friends
        /// </summary>
        Task<bool> AreFriendsAsync(string userId1, string userId2);
        
        /// <summary>
        /// Check if there's a pending request between two users
        /// </summary>
        Task<bool> HasPendingRequestAsync(string userId1, string userId2);
        
        #endregion
    }
}
