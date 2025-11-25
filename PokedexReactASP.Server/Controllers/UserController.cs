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

        [HttpPost("pokemon/catch")]
        public async Task<ActionResult> CatchPokemon([FromBody] CatchPokemonDto catchPokemonDto)
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
            if (!result)
            {
                return BadRequest(new { message = "Failed to catch Pokemon. It may already be in your collection or doesn't exist." });
            }

            return Ok(new { message = "Pokemon caught successfully!" });
        }

        [HttpDelete("pokemon/{pokemonId}")]
        public async Task<ActionResult> ReleasePokemon(int pokemonId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.ReleasePokemonAsync(userId, pokemonId);
            if (!result)
            {
                return NotFound(new { message = "Pokemon not found in your collection" });
            }

            return Ok(new { message = "Pokemon released successfully" });
        }

        [HttpPut("pokemon/{pokemonId}/nickname")]
        public async Task<ActionResult> UpdatePokemonNickname(int pokemonId, [FromBody] string nickname)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.UpdatePokemonNicknameAsync(userId, pokemonId, nickname);
            if (!result)
            {
                return NotFound(new { message = "Pokemon not found in your collection" });
            }

            return Ok(new { message = "Nickname updated successfully" });
        }

        [HttpPut("pokemon/{pokemonId}/favorite")]
        public async Task<ActionResult> ToggleFavoritePokemon(int pokemonId)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.ToggleFavoritePokemonAsync(userId, pokemonId);
            if (!result)
            {
                return NotFound(new { message = "Pokemon not found in your collection" });
            }

            return Ok(new { message = "Favorite status updated successfully" });
        }
    }
}
