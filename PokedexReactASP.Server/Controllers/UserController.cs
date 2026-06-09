using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.User;
using PokedexReactASP.Application.DTOs.Achievement;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Server.Controllers
{
    [Authorize]
    public class UserController : ApiControllerBase
    {
        private readonly IUserProfileService _profileService;
        private readonly IPokemonCollectionService _collectionService;
        private readonly IPokemonCatchService _catchService;
        private readonly IAchievementService _achievementService;
        private readonly IPokemonBoxService _boxService;

        public UserController(
            IUserProfileService profileService,
            IPokemonCollectionService collectionService,
            IPokemonCatchService catchService,
            IAchievementService achievementService,
            IPokemonBoxService boxService)
        {
            _profileService    = profileService;
            _collectionService = collectionService;
            _catchService      = catchService;
            _achievementService = achievementService;
            _boxService        = boxService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();

            var profile = await _profileService.GetUserProfileAsync(CurrentUserId);
            return profile == null ? NotFound(new { message = "User not found" }) : Ok(profile);
        }

        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();

            var result = await _profileService.UpdateUserProfileAsync(CurrentUserId, updateProfileDto);
            return result ? Ok(new { message = "Profile updated successfully" }) : BadRequest(new { message = "Failed to update profile" });
        }

        #region Pokemon Collection Endpoints

        /// <summary>Get all Pokemon in user's collection with enriched PokeAPI data</summary>
        [HttpGet("pokemon")]
        public async Task<ActionResult<IEnumerable<UserPokemonDto>>> GetMyPokemon()
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            return Ok(await _collectionService.GetUserPokemonAsync(CurrentUserId));
        }

        /// <summary>Get a specific Pokemon from user's collection</summary>
        [HttpGet("pokemon/{userPokemonId}")]
        public async Task<ActionResult<UserPokemonDto>> GetPokemonById(int userPokemonId)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var pokemon = await _collectionService.GetUserPokemonByIdAsync(CurrentUserId, userPokemonId);
            return pokemon == null ? NotFound(new { message = "Pokemon not found in your collection" }) : Ok(pokemon);
        }

        /// <summary>Get collection statistics</summary>
        [HttpGet("pokemon/stats")]
        public async Task<ActionResult<CollectionStatsDto>> GetCollectionStats()
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            return Ok(await _collectionService.GetCollectionStatsAsync(CurrentUserId));
        }

        /// <summary>Get Pokemon summary</summary>
        [HttpGet("pokemon/summary")]
        public async Task<ActionResult<PokeSummaryResponseDto>> GetPokeSummary()
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            return Ok(await _collectionService.GetPokeSummaryAsync(CurrentUserId));
        }

        /// <summary>Attempt to catch a Pokemon using Game Mechanics (catch rate, shake count, etc.)</summary>
        [HttpPost("pokemon/attempt-catch")]
        public async Task<ActionResult<CatchAttemptResultDto>> AttemptCatchPokemon([FromBody] CatchAttemptDto catchAttemptDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            return Ok(await _catchService.AttemptCatchPokemonAsync(CurrentUserId, catchAttemptDto));
        }

        /// <summary>Catch a Pokemon and add it to collection (legacy — always succeeds)</summary>
        [HttpPost("pokemon/catch")]
        public async Task<ActionResult<CatchResultDto>> CatchPokemon([FromBody] CatchPokemonDto catchPokemonDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var result = await _catchService.CatchPokemonAsync(CurrentUserId, catchPokemonDto);
            return result.Success ? Ok(result) : BadRequest(result);
        }


        /// <summary>Release a Pokemon from collection</summary>
        [HttpDelete("pokemon/{userPokemonId}")]
        public async Task<ActionResult> ReleasePokemon(int userPokemonId)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var result = await _catchService.ReleasePokemonAsync(CurrentUserId, userPokemonId);
            return result ? Ok(new { message = "Pokemon released successfully" }) : NotFound(new { message = "Pokemon not found in your collection" });
        }

        /// <summary>Update Pokemon nickname</summary>
        [HttpPut("pokemon/{userPokemonId}/nickname")]
        public async Task<ActionResult> UpdatePokemonNickname(int userPokemonId, [FromBody] UpdateNicknameDto dto)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var result = await _catchService.UpdatePokemonNicknameAsync(CurrentUserId, userPokemonId, dto.Nickname);
            return result.Success
                ? Ok(new { message = "Nickname updated successfully", nickname = result.ResultName })
                : NotFound(new { message = "Pokemon not found in your collection" });
        }

        /// <summary>Toggle favorite status</summary>
        [HttpPut("pokemon/{userPokemonId}/favorite")]
        public async Task<ActionResult> ToggleFavoritePokemon(int userPokemonId)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var result = await _catchService.ToggleFavoritePokemonAsync(CurrentUserId, userPokemonId);
            return result ? Ok(new { message = "Favorite status updated successfully" }) : NotFound(new { message = "Pokemon not found in your collection" });
        }

        /// <summary>Update Pokemon notes</summary>
        [HttpPut("pokemon/{userPokemonId}/notes")]
        public async Task<ActionResult> UpdatePokemonNotes(int userPokemonId, [FromBody] UpdateNotesDto dto)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var result = await _catchService.UpdatePokemonNotesAsync(CurrentUserId, userPokemonId, dto.Notes);
            return result ? Ok(new { message = "Notes updated successfully" }) : NotFound(new { message = "Pokemon not found in your collection" });
        }

        /// <summary>Update Pokemon moves</summary>
        [HttpPut("pokemon/{userPokemonId}/moves")]
        public async Task<ActionResult> UpdatePokemonMoves(int userPokemonId, [FromBody] List<int> moveIds)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            if (moveIds == null || moveIds.Count > 4) return BadRequest(new { message = "Invalid moveset. Maximum 4 moves allowed." });

            var result = await _catchService.UpdatePokemonMovesAsync(CurrentUserId, userPokemonId, moveIds);
            return result 
                ? Ok(new { message = "Moveset updated successfully" }) 
                : NotFound(new { message = "Pokemon not found in your collection" });
        }

        /// <summary>Get user's achievements with progress</summary>
        [HttpGet("achievements")]
        public async Task<ActionResult<IEnumerable<UserAchievementStatusDto>>> GetAchievements()
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var achievements = await _achievementService.GetUserAchievementsAsync(CurrentUserId);
            return Ok(achievements);
        }

        /// <summary>Unlock a specific achievement (e.g., gym badge) manually or simulate battle</summary>
        [HttpPost("achievements/unlock/{achievementId}")]
        public async Task<ActionResult> UnlockAchievement(string achievementId)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var success = await _achievementService.UnlockAchievementManuallyAsync(CurrentUserId, achievementId);
            return success 
                ? Ok(new { message = "Achievement unlocked successfully" }) 
                : BadRequest(new { message = "Failed to unlock achievement. Make sure the ID is correct and not already unlocked." });
        }

        #endregion

        #region Box Storage Endpoints

        /// <summary>Get all boxes and their pokemon for the user</summary>
        [HttpGet("boxes")]
        public async Task<ActionResult<IEnumerable<UserBoxDto>>> GetBoxes(CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            return Ok(await _boxService.GetBoxesAsync(CurrentUserId, cancellationToken));
        }

        /// <summary>Update box details (name, background image)</summary>
        [HttpPut("boxes/{boxId}")]
        public async Task<ActionResult<UserBoxDto>> UpdateBox(int boxId, [FromBody] UpdateBoxDto dto, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var result = await _boxService.UpdateBoxAsync(CurrentUserId, boxId, dto, cancellationToken);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>Moves a caught Pokemon to a new box or party slot, swapping positions if occupied.</summary>
        [HttpPut("pokemon/{userPokemonId}/move")]
        public async Task<ActionResult<MovePokemonResultDto>> MovePokemon(int userPokemonId, [FromBody] MovePokemonDto dto, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _boxService.MovePokemonAsync(CurrentUserId, userPokemonId, dto, cancellationToken);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>Moves a group of Pokemon to new box slots (Group Move). All target slots must be unoccupied.</summary>
        [HttpPut("pokemon/move-batch")]
        public async Task<ActionResult> MovePokemonBatch([FromBody] BatchMovePokemonDto dto, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _boxService.MovePokemonBatchAsync(CurrentUserId, dto, cancellationToken);
            return success ? Ok(new { message = "Batch move completed successfully." }) : BadRequest(new { message = "Batch move failed. One or more target slots are occupied." });
        }

        /// <summary>Swaps the display order of two boxes.</summary>
        [HttpPut("boxes/reorder")]
        public async Task<ActionResult> ReorderBoxes([FromBody] ReorderBoxesDto dto, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _boxService.ReorderBoxesAsync(CurrentUserId, dto, cancellationToken);
            return success ? Ok(new { message = "Boxes reordered successfully." }) : BadRequest(new { message = "Failed to reorder boxes." });
        }

        #endregion
    }
}
