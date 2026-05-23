using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

            var result = await _wildAreaService.GetCurrentWildAreaAsync(userId);
            return Ok(result);
        }
    }
}
