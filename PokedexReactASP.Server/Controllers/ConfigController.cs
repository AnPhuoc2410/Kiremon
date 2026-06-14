using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using System;
using System.Threading.Tasks;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/admin/config")]
    public class ConfigController : ControllerBase
    {
        private readonly ISystemConfigService _configService;

        public ConfigController(ISystemConfigService configService)
        {
            _configService = configService;
        }

        [HttpGet("wild-area")]
        public async Task<ActionResult<WildAreaSettings>> GetWildAreaConfig()
        {
            var settings = await _configService.GetWildAreaSettingsAsync();
            return Ok(settings);
        }

        [HttpPut("wild-area")]
        public async Task<IActionResult> UpdateWildAreaConfig([FromBody] WildAreaSettings settings)
        {
            if (settings == null)
            {
                return BadRequest(new { message = "Invalid configuration data" });
            }

            if (settings.ResetIntervalMinutes <= 0)
            {
                return BadRequest(new { message = "ResetIntervalMinutes must be greater than 0" });
            }

            if (settings.SpawnCount <= 0)
            {
                return BadRequest(new { message = "SpawnCount must be greater than 0" });
            }

            try
            {
                await _configService.SaveWildAreaSettingsAsync(settings);
                return Ok(new { message = "Wild Area configuration updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Failed to save configuration: {ex.Message}" });
            }
        }

        [HttpGet("card-reward")]
        public async Task<ActionResult<CardRewardSettings>> GetCardRewardConfig()
        {
            var settings = await _configService.GetCardRewardSettingsAsync();
            return Ok(settings);
        }

        [HttpPut("card-reward")]
        public async Task<IActionResult> UpdateCardRewardConfig([FromBody] CardRewardSettings settings)
        {
            if (settings == null)
            {
                return BadRequest(new { message = "Invalid configuration data" });
            }

            try
            {
                await _configService.SaveCardRewardSettingsAsync(settings);
                return Ok(new { message = "Card Reward configuration updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Failed to save configuration: {ex.Message}" });
            }
        }
    }
}
