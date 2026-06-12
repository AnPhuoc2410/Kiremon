namespace PokedexReactASP.Application.DTOs.Inventory
{
    /// <summary>
    /// A single stack of items the user owns (fungible, grouped by ItemApiId).
    /// </summary>
    public class UserItemDto
    {
        public int Id { get; set; }
        public int ItemApiId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SpriteUrl { get; set; } = string.Empty;
        public string? Description { get; set; }

        public string PocketName { get; set; } = "misc";
        public string CategoryName { get; set; } = string.Empty;
        public int Quantity { get; set; }

        public bool IsHoldable { get; set; }
        public bool IsConsumable { get; set; }
        public bool UsableInBattle { get; set; }

        public DateTime UpdatedAt { get; set; }
    }

    /// <summary>
    /// Query/filter options for the user's bag.
    /// </summary>
    public class MyInventoryQueryDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 30;

        /// <summary>Optional pocket filter (e.g. "medicine", "pokeballs").</summary>
        public string? PocketName { get; set; }

        /// <summary>
        /// Optional PokeAPI item category slug filter (matches <see cref="UserItemDto.CategoryName"/>).
        /// </summary>
        public string? CategoryName { get; set; }

        /// <summary>"name-asc", "name-desc", "qty-desc", "qty-asc", "updated-desc" (default).</summary>
        public string? Sort { get; set; } = "updated-desc";
    }

    /// <summary>
    /// Aggregated counts for one category in the user's bag (used for category tabs).
    /// </summary>
    public class InventoryCategorySummaryDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public int StackCount { get; set; }
        public int TotalQuantity { get; set; }
    }

    public class PagedInventoryResponseDto
    {
        public List<UserItemDto> Items { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        /// <summary>Per-category counts for the full bag (ignores active category filter).</summary>
        public List<InventoryCategorySummaryDto> Categories { get; set; } = new();
    }

    /// <summary>
    /// Adds an item to the bag (or stacks onto an existing one with the same ItemApiId).
    /// Descriptive fields come from the client (PokeAPI data already loaded in the Market).
    /// </summary>
    public class AddItemDto
    {
        public int ItemApiId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SpriteUrl { get; set; } = string.Empty;
        public string? Description { get; set; }

        /// <summary>Raw pocket name from PokeAPI; the server normalizes it via PokeItemMapper.</summary>
        public string? ApiPocketName { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public int Quantity { get; set; } = 1;

        public bool IsHoldable { get; set; }
        public bool IsConsumable { get; set; }
        public bool UsableInBattle { get; set; }
    }

    /// <summary>
    /// Consumes (decrements) a number of items from a stack.
    /// </summary>
    public class ConsumeItemDto
    {
        public int Quantity { get; set; } = 1;
    }
}
