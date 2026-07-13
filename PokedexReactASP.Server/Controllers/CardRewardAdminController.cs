using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/admin/card-reward")]
    public class CardRewardAdminController(ICardRewardAdminService adminService) : ControllerBase
    {
        [HttpGet("settings")]
        public async Task<ActionResult<CardRewardSettings>> GetSettings()
        {
            var settings = await adminService.GetSettingsAsync();
            return Ok(settings);
        }

        [HttpPost("settings")]
        public async Task<IActionResult> UpdateSettings([FromBody] CardRewardSettings settings)
        {
            await adminService.UpdateSettingsAsync(settings);
            return Ok(new { message = "Card Reward settings updated successfully" });
        }
    }
}
