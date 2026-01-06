using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.User;
using PokedexReactASP.Application.Interfaces;
using System.Security.Claims;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        #region Profile Endpoints

        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var profile = await _userService.GetUserProfileAsync(userId);
            if (profile == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(profile);
        }

        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.UpdateUserProfileAsync(userId, updateProfileDto);
            if (!result)
            {
                return BadRequest(new { message = "Failed to update profile" });
            }

            return Ok(new { message = "Profile updated successfully" });
        }

        #endregion

        #region Pokemon Collection Endpoints

        /// <summary>
        /// Get all Pokemon in user's collection with enriched PokeAPI data
        /// </summary>
        [HttpGet("pokemon")]
        public async Task<ActionResult<IEnumerable<UserPokemonDto>>> GetMyPokemon()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var pokemon = await _userService.GetUserPokemonAsync(userId);
            return Ok(pokemon);
        }

        /// <summary>
        /// Get a specific Pokemon from user's collection
        /// </summary>
        [HttpGet("pokemon/{userPokemonId}")]
        public async Task<ActionResult<UserPokemonDto>> GetPokemonById(int userPokemonId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var pokemon = await _userService.GetUserPokemonByIdAsync(userId, userPokemonId);
            if (pokemon == null)
            {
                return NotFound(new { message = "Pokemon not found in your collection" });
            }

            return Ok(pokemon);
        }

        /// <summary>
        /// Get collection statistics
        /// </summary>
        [HttpGet("pokemon/stats")]
        public async Task<ActionResult<CollectionStatsDto>> GetCollectionStats()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var stats = await _userService.GetCollectionStatsAsync(userId);
            return Ok(stats);
        }

        /// <summary>
        /// Get Pokemon summary
        /// </summary>
        [HttpGet("pokemon/summary")]
        public async Task<ActionResult<PokeSummaryResponseDto>> GetPokeSummary()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var summary = await _userService.GetPokeSummaryAsync(userId);
            return Ok(summary);
        }

        /// <summary>
        /// Attempt to catch a Pokemon using Game Mechanics (catch rate calculation, shake count, etc.)
        /// </summary>
        [HttpPost("pokemon/attempt-catch")]
        public async Task<ActionResult<CatchAttemptResultDto>> AttemptCatchPokemon([FromBody] CatchAttemptDto catchAttemptDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.AttemptCatchPokemonAsync(userId, catchAttemptDto);
            return Ok(result);
        }

        /// <summary>
        /// Catch a Pokemon and add it to collection (legacy - always succeeds)
        /// </summary>
        [HttpPost("pokemon/catch")]
        public async Task<ActionResult<CatchResultDto>> CatchPokemon([FromBody] CatchPokemonDto catchPokemonDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.CatchPokemonAsync(userId, catchPokemonDto);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Release a Pokemon from collection
        /// </summary>
        [HttpDelete("pokemon/{userPokemonId}")]
        public async Task<ActionResult> ReleasePokemon(int userPokemonId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.ReleasePokemonAsync(userId, userPokemonId);
            if (!result)
            {
                return NotFound(new { message = "Pokemon not found in your collection" });
            }

            return Ok(new { message = "Pokemon released successfully" });
        }

        /// <summary>
        /// Update Pokemon nickname
        /// </summary>
        [HttpPut("pokemon/{userPokemonId}/nickname")]
        public async Task<ActionResult> UpdatePokemonNickname(int userPokemonId, [FromBody] UpdateNicknameDto dto)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.UpdatePokemonNicknameAsync(userId, userPokemonId, dto.Nickname);
            if (!result.Success)
            {
                return NotFound(new { message = "Pokemon not found in your collection" });
            }

            return Ok(new { message = "Nickname updated successfully", nickname = result.ResultName });
        }

        /// <summary>
        /// Toggle favorite status
        /// </summary>
        [HttpPut("pokemon/{userPokemonId}/favorite")]
        public async Task<ActionResult> ToggleFavoritePokemon(int userPokemonId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.ToggleFavoritePokemonAsync(userId, userPokemonId);
            if (!result)
            {
                return NotFound(new { message = "Pokemon not found in your collection" });
            }

            return Ok(new { message = "Favorite status updated successfully" });
        }

        /// <summary>
        /// Update Pokemon notes
        /// </summary>
        [HttpPut("pokemon/{userPokemonId}/notes")]
        public async Task<ActionResult> UpdatePokemonNotes(int userPokemonId, [FromBody] UpdateNotesDto dto)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.UpdatePokemonNotesAsync(userId, userPokemonId, dto.Notes);
            if (!result)
            {
                return NotFound(new { message = "Pokemon not found in your collection" });
            }

            return Ok(new { message = "Notes updated successfully" });
        }

        #endregion
    }
}
