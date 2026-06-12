using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.DTOs.Market;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Server.Controllers
{
    [Authorize]
    [Route("api/market")]
    public class MarketController : ApiControllerBase
    {
        private readonly IMarketService _marketService;

        public MarketController(IMarketService marketService)
        {
            _marketService = marketService;
        }

        [HttpPost("buy")]
        public async Task<ActionResult<PurchaseResultDto>> Buy([FromBody] PurchaseItemDto dto)
        {
            if (string.IsNullOrWhiteSpace(CurrentUserId))
            {
                return Unauthorized();
            }

            if (dto.ItemApiId <= 0)
            {
                return BadRequest(new { message = "itemApiId must be greater than 0." });
            }

            var result = await _marketService.PurchaseItemAsync(CurrentUserId, dto);

            // Business failures (not enough coins, not for sale...) return 400 with details.
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
