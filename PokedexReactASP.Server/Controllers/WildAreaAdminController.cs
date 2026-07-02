using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/admin/wild-area")]
    public class WildAreaAdminController : ControllerBase
    {
        private readonly IPokemonSpawnMetadataSyncService _syncService;
        private readonly IPokemonBiomeTagService _biomeTagService;
        private readonly IWildAreaAdminService _adminService;

        public WildAreaAdminController(
            IPokemonSpawnMetadataSyncService syncService,
            IPokemonBiomeTagService biomeTagService,
            IWildAreaAdminService adminService)
        {
            _syncService = syncService;
            _biomeTagService = biomeTagService;
            _adminService = adminService;
        }

        [HttpGet("settings")]
        public async Task<ActionResult<PokedexReactASP.Application.Options.WildAreaSettings>> GetSettings()
        {
            var settings = await _adminService.GetSettingsAsync();
            return Ok(settings);
        }

        [HttpPost("settings")]
        public async Task<IActionResult> UpdateSettings([FromBody] PokedexReactASP.Application.Options.WildAreaSettings settings)
        {
            await _adminService.UpdateSettingsAsync(settings);
            return Ok(new { message = "Settings updated successfully" });
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
