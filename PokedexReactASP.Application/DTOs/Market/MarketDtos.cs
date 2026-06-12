using PokedexReactASP.Application.DTOs.Inventory;

namespace PokedexReactASP.Application.DTOs.Market
{
    /// <summary>
    /// Request to buy an item from the Poké Mart.
    /// The unit cost is resolved server-side from PokeAPI (never trusted from the client).
    /// Descriptive fields are cosmetic and used only to populate the bag entry.
    /// </summary>
    public class PurchaseItemDto
    {
        public int ItemApiId { get; set; }
        public int Quantity { get; set; } = 1;

        // Cosmetic/display fields (already loaded by the Market UI from PokeAPI).
        public string? Name { get; set; }
        public string? SpriteUrl { get; set; }
        public string? Description { get; set; }
        public string? ApiPocketName { get; set; }
        public string? CategoryName { get; set; }

        public bool IsHoldable { get; set; }
        public bool IsConsumable { get; set; }
        public bool UsableInBattle { get; set; }
    }

    /// <summary>
    /// Result of a purchase attempt.
    /// </summary>
    public class PurchaseResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;

        public int UnitCost { get; set; }
        public int Quantity { get; set; }
        public int TotalCost { get; set; }
        public int RemainingCoins { get; set; }

        /// <summary>The resulting bag stack (null when the purchase failed).</summary>
        public UserItemDto? Item { get; set; }
    }
}
