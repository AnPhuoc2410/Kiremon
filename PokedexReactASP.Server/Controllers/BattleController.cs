using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace PokedexReactASP.Server.Controllers
{
    [Authorize]
    public class BattleController : ApiControllerBase
    {
        private readonly PokemonDbContext _context;
        private readonly ICacheService _cache;

        public BattleController(PokemonDbContext context, ICacheService cache)
        {
            _context = context;
            _cache = cache;
        }

        /// <summary>
        /// Retrieves static Gym Leader info and roster from PostgreSQL.
        /// </summary>
        [HttpGet("leader/{leaderId}")]
        public async Task<ActionResult<GymLeader>> GetGymLeader(string leaderId)
        {
            var leader = await _context.GymLeaders
                .FirstOrDefaultAsync(l => l.Id == leaderId);

            if (leader == null)
            {
                return NotFound(new { message = $"Gym Leader with ID '{leaderId}' not found." });
            }

            return Ok(leader);
        }

        /// <summary>
        /// Retrieves the user's active battle state from Redis.
        /// </summary>
        [HttpGet("state/{key}")]
        public async Task<ActionResult<object>> GetBattleState(string key)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();

            var cacheKey = $"battle_state:{CurrentUserId}:{key}";
            var state = await _cache.GetAsync<object>(cacheKey);

            if (state == null)
            {
                return NotFound(new { message = "No active battle state found." });
            }

            return Ok(state);
        }

        /// <summary>
        /// Saves or updates the user's active battle state in Redis (1-hour expiration).
        /// </summary>
        [HttpPost("state/{key}")]
        public async Task<ActionResult> SaveBattleState(string key, [FromBody] JsonElement state)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();

            var cacheKey = $"battle_state:{CurrentUserId}:{key}";
            
            // Set cache state with a 1-hour expiration
            await _cache.SetAsync(cacheKey, state, TimeSpan.FromHours(1));

            return Ok(new { message = "Battle state saved successfully." });
        }

        /// <summary>
        /// Deletes the user's active battle state from Redis when the battle finishes.
        /// </summary>
        [HttpDelete("state/{key}")]
        public async Task<ActionResult> ClearBattleState(string key)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();

            var cacheKey = $"battle_state:{CurrentUserId}:{key}";
            await _cache.RemoveAsync(cacheKey);

            return Ok(new { message = "Battle state cleared successfully." });
        }
    }
}
