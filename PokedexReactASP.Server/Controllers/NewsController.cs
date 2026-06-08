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

        public NewsController(IPokemonNewsSyncService newsSyncService)
        {
            _newsSyncService = newsSyncService;
        }

        [HttpPost("sync")]
        public async Task<IActionResult> Sync()
        {
            var result = await _newsSyncService.SyncNewsAsync();
            return Ok(result);
        }
    }
}
