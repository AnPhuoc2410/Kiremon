using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PokedexReactASP.Application.Exceptions;
using PokedexReactASP.Application.DTOs.WildArea;
using PokedexReactASP.Application.Interfaces;
using System.Security.Claims;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/wild-area")]
    [Authorize]
    public class WildAreaController : ControllerBase
    {
        private readonly IWildAreaService _wildAreaService;

        public WildAreaController(IWildAreaService wildAreaService)
        {
            _wildAreaService = wildAreaService;
        }

        [HttpGet("current")]
        public async Task<ActionResult<WildAreaDto>> GetCurrent()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            try
            {
                var result = await _wildAreaService.GetCurrentWildAreaAsync(userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<WildAreaDto>> Refresh()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            try
            {
                var result = await _wildAreaService.RefreshWildAreaAsync(userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = ex.Message });
            }
        }

        [HttpPost("spawns/{spawnId:int}/attempt-catch")]
        [EnableRateLimiting("WildCatchPolicy")]
        public async Task<ActionResult<WildCatchResultDto>> AttemptCatch(int spawnId, [FromBody] WildCatchAttemptDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            try
            {
                var result = await _wildAreaService.AttemptCatchAsync(userId, spawnId, dto);
                return Ok(result);
            }
            catch (WildAreaCatchException ex)
            {
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
        }
    }
}
