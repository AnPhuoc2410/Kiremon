using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/admin/wild-area")]
    public class WildAreaAdminController : ControllerBase
    {
        private readonly IPokemonSpawnMetadataSyncService _syncService;

        public WildAreaAdminController(IPokemonSpawnMetadataSyncService syncService)
        {
            _syncService = syncService;
        }

        [HttpPost("sync-spawn-metadata")]
        public async Task<ActionResult<PokemonSpawnMetadataSyncResultDto>> SyncSpawnMetadata([FromQuery] bool force = false, CancellationToken cancellationToken = default)
        {
            var result = await _syncService.SyncAsync(force, cancellationToken);
            return Ok(result);
        }
    }
}
