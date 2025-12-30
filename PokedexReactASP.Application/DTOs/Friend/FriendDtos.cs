using System;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.DTOs.Friend
{
    /// <summary>
    /// DTO for displaying a friend in the friends list
    /// </summary>
    public class FriendDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public int TrainerLevel { get; set; }
        public string? FavoriteType { get; set; }
        public DateTime FriendsSince { get; set; }
        public int FriendshipLevel { get; set; }
        public bool IsOnline { get; set; }
        public DateTime LastActiveDate { get; set; }
        
        // Stats
        public int PokemonCaught { get; set; }
        public int TradesWithFriend { get; set; }
        public int BattlesWithFriend { get; set; }
        
        // Optional nickname given to this friend
        public string? Nickname { get; set; }
    }

    /// <summary>
    /// DTO for displaying a pending friend request
    /// </summary>
    public class FriendRequestDto
    {
        public int RequestId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public int TrainerLevel { get; set; }
        public string? Message { get; set; }
        public DateTime SentAt { get; set; }
        public FriendRequestStatus Status { get; set; }
        public bool IsSentByMe { get; set; }
    }

    /// <summary>
    /// Request DTO for sending a friend request
    /// </summary>
    public class SendFriendRequestDto
    {
        /// <summary>
        /// Friend code to add (format: XXXX-XXXX-XXXX)
        /// </summary>
        public string FriendCode { get; set; } = string.Empty;
        
        /// <summary>
        /// Optional message to include with the request
        /// </summary>
        public string? Message { get; set; }
    }

    /// <summary>
    /// Request DTO for responding to a friend request
    /// </summary>
    public class RespondFriendRequestDto
    {
        public int RequestId { get; set; }
        public bool Accept { get; set; }
    }

    /// <summary>
    /// Response DTO for friend-related operations
    /// </summary>
    public class FriendOperationResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public FriendDto? NewFriend { get; set; }
    }

    /// <summary>
    /// DTO for displaying user's friend code and QR data
    /// </summary>
    public class FriendCodeDto
    {
        public string FriendCode { get; set; } = string.Empty;
        public string QrCodeData { get; set; } = string.Empty; // Base64 encoded QR code or data URI
        public string Username { get; set; } = string.Empty;
        public int TrainerLevel { get; set; }
    }

    /// <summary>
    /// DTO for searching users to add as friends
    /// </summary>
    public class UserSearchResultDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public int TrainerLevel { get; set; }
        public string FriendCode { get; set; } = string.Empty;
        public bool IsFriend { get; set; }
        public bool HasPendingRequest { get; set; }
    }

    /// <summary>
    /// DTO for friends overview/summary
    /// </summary>
    public class FriendsSummaryDto
    {
        public int TotalFriends { get; set; }
        public int OnlineFriends { get; set; }
        public int PendingRequestsReceived { get; set; }
        public int PendingRequestsSent { get; set; }
        public string MyFriendCode { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request DTO for updating friend nickname
    /// </summary>
    public class UpdateFriendNicknameDto
    {
        public string FriendUserId { get; set; } = string.Empty;
        public string? Nickname { get; set; }
    }
}
