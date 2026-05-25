using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/admin/wild-area")]
    public class WildAreaAdminController : ControllerBase
    {
        private readonly IPokemonSpawnMetadataSyncService _syncService;
        private readonly IPokemonBiomeTagService _biomeTagService;

        public WildAreaAdminController(
            IPokemonSpawnMetadataSyncService syncService,
            IPokemonBiomeTagService biomeTagService)
        {
            _syncService = syncService;
            _biomeTagService = biomeTagService;
        }

        [HttpPost("sync-spawn-metadata")]
        public async Task<ActionResult<PokemonSpawnMetadataSyncResultDto>> SyncSpawnMetadata(
            [FromQuery] bool force = false,
            CancellationToken cancellationToken = default)
        {
            var result = await _syncService.SyncAsync(force, cancellationToken);
            return Ok(result);
        }

        [HttpPost("regenerate-biome-tags")]
        public async Task<ActionResult<PokemonBiomeTagRegenerationResultDto>> RegenerateBiomeTags(
            [FromQuery] bool clearAuto = true,
            CancellationToken cancellationToken = default)
        {
            var result = await _biomeTagService.RegenerateTagsAsync(clearAuto, cancellationToken);
            return Ok(result);
        }

        [HttpGet("debug/candidates")]
        public async Task<ActionResult<IReadOnlyList<WildAreaCandidateDebugDto>>> GetCandidateDebug(
            [FromQuery] string areaCode,
            [FromQuery] WildSpawnRarity rarity = WildSpawnRarity.Common,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(areaCode))
            {
                return BadRequest(new { message = "areaCode is required." });
            }

            try
            {
                var result = await _biomeTagService.GetCandidateDebugAsync(areaCode, rarity, cancellationToken);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
