using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.DTOs.Inventory;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Server.Controllers
{
    [Authorize]
    [Route("api/inventory")]
    public class InventoryController : ApiControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet("my-items")]
        public async Task<ActionResult<PagedInventoryResponseDto>> GetMyItems([FromQuery] MyInventoryQueryDto query)
        {
            if (string.IsNullOrWhiteSpace(CurrentUserId))
            {
                return Unauthorized();
            }

            if (query.Page < 1 || query.PageSize < 1)
            {
                return BadRequest(new { message = "Page and pageSize must be greater than 0." });
            }

            var result = await _inventoryService.GetMyItemsAsync(CurrentUserId, query);
            return Ok(result);
        }

        [HttpGet("{userItemId:int}")]
        public async Task<ActionResult<UserItemDto>> GetItem(int userItemId)
        {
            if (string.IsNullOrWhiteSpace(CurrentUserId))
            {
                return Unauthorized();
            }

            var item = await _inventoryService.GetItemAsync(CurrentUserId, userItemId);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<UserItemDto>> AddItem([FromBody] AddItemDto dto)
        {
            if (string.IsNullOrWhiteSpace(CurrentUserId))
            {
                return Unauthorized();
            }

            if (dto.ItemApiId <= 0)
            {
                return BadRequest(new { message = "itemApiId must be greater than 0." });
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest(new { message = "name is required." });
            }

            var result = await _inventoryService.AddOrStackItemAsync(CurrentUserId, dto);
            return Ok(result);
        }

        [HttpPost("{userItemId:int}/consume")]
        public async Task<ActionResult<UserItemDto>> ConsumeItem(int userItemId, [FromBody] ConsumeItemDto dto)
        {
            if (string.IsNullOrWhiteSpace(CurrentUserId))
            {
                return Unauthorized();
            }

            var quantity = dto.Quantity < 1 ? 1 : dto.Quantity;
            var result = await _inventoryService.ConsumeItemAsync(CurrentUserId, userItemId, quantity);

            // null means the stack was fully consumed and removed.
            return Ok(result);
        }
    }
}
