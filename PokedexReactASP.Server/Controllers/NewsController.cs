using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/news")]
    public class NewsController : ControllerBase
    {
        private readonly IPokemonNewsSyncService _newsSyncService;
        private readonly IPokemonNewsService _newsService;

        public NewsController(
            IPokemonNewsSyncService newsSyncService,
            IPokemonNewsService newsService)
        {
            _newsSyncService = newsSyncService;
            _newsService = newsService;
        }

        [HttpPost("sync")]
        public async Task<IActionResult> Sync()
        {
            var result = await _newsSyncService.SyncNewsAsync();
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetLatestNews([FromQuery] int limit = 10)
        {
            var news = await _newsService.GetLatestNewsAsync(limit);
            return Ok(news);
        }

        [HttpPost("{id}/view")]
        public async Task<IActionResult> IncrementViews(int id)
        {
            var result = await _newsService.IncrementViewCountAsync(id);
            if (!result)
            {
                return NotFound(new { message = "News article not found." });
            }
            return NoContent();
        }
    }
}
