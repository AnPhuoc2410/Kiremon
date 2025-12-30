using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.DTOs.Friend;
using PokedexReactASP.Application.Interfaces;
using System.Security.Claims;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendController : ControllerBase
    {
        private readonly IFriendService _friendService;

        public FriendController(IFriendService friendService)
        {
            _friendService = friendService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        #region Friend Code & QR

        /// <summary>
        /// Get current user's friend code and QR data
        /// </summary>
        [HttpGet("code")]
        public async Task<ActionResult<FriendCodeDto>> GetMyFriendCode()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            try
            {
                var result = await _friendService.GetMyFriendCodeAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Regenerate friend code (invalidates old one)
        /// </summary>
        [HttpPost("code/regenerate")]
        public async Task<ActionResult<FriendCodeDto>> RegenerateFriendCode()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            try
            {
                var result = await _friendService.RegenerateFriendCodeAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Friend Requests

        /// <summary>
        /// Send a friend request using friend code
        /// </summary>
        [HttpPost("request")]
        public async Task<ActionResult<FriendOperationResultDto>> SendFriendRequest([FromBody] SendFriendRequestDto request)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(request.FriendCode))
                return BadRequest(new { message = "Friend code is required" });

            var result = await _friendService.SendFriendRequestAsync(userId, request);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Get all received friend requests (pending)
        /// </summary>
        [HttpGet("requests/received")]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> GetReceivedRequests()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var requests = await _friendService.GetReceivedFriendRequestsAsync(userId);
            return Ok(requests);
        }

        /// <summary>
        /// Get all sent friend requests (pending)
        /// </summary>
        [HttpGet("requests/sent")]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> GetSentRequests()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var requests = await _friendService.GetSentFriendRequestsAsync(userId);
            return Ok(requests);
        }

        /// <summary>
        /// Accept a friend request
        /// </summary>
        [HttpPost("request/{requestId}/accept")]
        public async Task<ActionResult<FriendOperationResultDto>> AcceptRequest(int requestId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _friendService.AcceptFriendRequestAsync(userId, requestId);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Decline a friend request
        /// </summary>
        [HttpPost("request/{requestId}/decline")]
        public async Task<ActionResult<FriendOperationResultDto>> DeclineRequest(int requestId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _friendService.DeclineFriendRequestAsync(userId, requestId);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Cancel a sent friend request
        /// </summary>
        [HttpDelete("request/{requestId}")]
        public async Task<ActionResult<FriendOperationResultDto>> CancelRequest(int requestId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _friendService.CancelFriendRequestAsync(userId, requestId);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        #endregion

        #region Friends List

        /// <summary>
        /// Get all friends
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FriendDto>>> GetFriends()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var friends = await _friendService.GetFriendsAsync(userId);
            return Ok(friends);
        }

        /// <summary>
        /// Get friends summary (counts, online status, etc.)
        /// </summary>
        [HttpGet("summary")]
        public async Task<ActionResult<FriendsSummaryDto>> GetFriendsSummary()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var summary = await _friendService.GetFriendsSummaryAsync(userId);
            return Ok(summary);
        }

        /// <summary>
        /// Remove a friend
        /// </summary>
        [HttpDelete("{friendUserId}")]
        public async Task<ActionResult<FriendOperationResultDto>> RemoveFriend(string friendUserId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _friendService.RemoveFriendAsync(userId, friendUserId);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Update nickname for a friend
        /// </summary>
        [HttpPut("nickname")]
        public async Task<ActionResult> UpdateFriendNickname([FromBody] UpdateFriendNicknameDto request)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var success = await _friendService.UpdateFriendNicknameAsync(userId, request);
            if (!success)
                return NotFound(new { message = "Friendship not found" });

            return Ok(new { message = "Nickname updated" });
        }

        #endregion

        #region Search & Discovery

        /// <summary>
        /// Search users by username or friend code
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<UserSearchResultDto>>> SearchUsers([FromQuery] string q)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(q) || q.Length < 3)
                return BadRequest(new { message = "Search term must be at least 3 characters" });

            var results = await _friendService.SearchUsersAsync(userId, q);
            return Ok(results);
        }

        /// <summary>
        /// Find user by friend code
        /// </summary>
        [HttpGet("find/{friendCode}")]
        public async Task<ActionResult<UserSearchResultDto>> FindByFriendCode(string friendCode)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _friendService.FindUserByFriendCodeAsync(userId, friendCode);
            if (result == null)
                return NotFound(new { message = "User not found with this friend code" });

            return Ok(result);
        }

        #endregion
    }
}
