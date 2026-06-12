using PokedexReactASP.Application.DTOs.Inventory;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Manages a trainer's bag (inventory of fungible items, stacked by quantity).
    /// Mirrors the TcgCard collection pattern: one row per (UserId, ItemApiId) with a Quantity.
    /// </summary>
    public interface IInventoryService
    {
        Task<PagedInventoryResponseDto> GetMyItemsAsync(string userId, MyInventoryQueryDto query);

        Task<UserItemDto?> GetItemAsync(string userId, int userItemId);

        /// <summary>
        /// Adds an item to the bag. If a stack with the same ItemApiId already exists,
        /// its quantity is incremented; otherwise a new stack is created.
        /// </summary>
        Task<UserItemDto> AddOrStackItemAsync(string userId, AddItemDto dto);

        /// <summary>
        /// Decrements the quantity of a stack. Removes the row when quantity reaches zero.
        /// Returns the updated stack, or null if it was fully consumed/removed.
        /// </summary>
        Task<UserItemDto?> ConsumeItemAsync(string userId, int userItemId, int quantity);
    }
}
