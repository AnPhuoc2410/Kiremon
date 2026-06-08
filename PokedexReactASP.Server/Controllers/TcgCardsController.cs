using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.DTOs.TcgCards;
using PokedexReactASP.Application.Interfaces;
using System.Security.Claims;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/tcg-cards")]
    [Authorize]
    public class TcgCardsController : ControllerBase
    {
        private readonly ITcgCardCollectionService _tcgCardCollectionService;

        public TcgCardsController(ITcgCardCollectionService tcgCardCollectionService)
        {
            _tcgCardCollectionService = tcgCardCollectionService;
        }

        [HttpGet("my-cards")]
        public async Task<ActionResult<PagedTcgCardsResponseDto>> GetMyCards([FromQuery] MyTcgCardsQueryDto query)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            if (query.Page < 1 || query.PageSize < 1)
            {
                return BadRequest(new { message = "Page and pageSize must be greater than 0." });
            }

            if (query.PokemonApiId.HasValue && query.PokemonApiId <= 0)
            {
                return BadRequest(new { message = "pokemonApiId must be greater than 0." });
            }

            var result = await _tcgCardCollectionService.GetMyCardsAsync(userId, query);
            return Ok(result);
        }

        [HttpGet("pokemon/{pokemonApiId:int}")]
        public async Task<ActionResult<IReadOnlyList<TcgCardDto>>> GetPokemonPreview(int pokemonApiId)
        {
            if (pokemonApiId <= 0)
            {
                return BadRequest(new { message = "pokemonApiId must be greater than 0." });
            }

            var result = await _tcgCardCollectionService.GetCardsByPokemonPreviewAsync(pokemonApiId);
            return Ok(result);
        }
    }
}
