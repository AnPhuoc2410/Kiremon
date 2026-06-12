using PokedexReactASP.Application.DTOs.Market;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Poké Mart purchasing. Validates the item cost server-side, deducts the trainer's
    /// coins, and grants the item to their bag — all in a single transaction.
    /// </summary>
    public interface IMarketService
    {
        Task<PurchaseResultDto> PurchaseItemAsync(string userId, PurchaseItemDto dto);
    }
}
