using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.DTOs.Inventory;
using PokedexReactASP.Application.DTOs.Market;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    /// <summary>
    /// Handles Poké Mart purchases. The unit cost is always resolved from PokeAPI so the
    /// client cannot tamper with prices. Coin deduction and item granting share the same
    /// scoped <see cref="PokemonDbContext"/>, wrapped in one transaction for atomicity.
    /// </summary>
    public class MarketService : IMarketService
    {
        private const int MaxQuantityPerPurchase = 999;

        private readonly PokemonDbContext _context;
        private readonly IPokeApiService _pokeApiService;
        private readonly IInventoryService _inventoryService;

        public MarketService(
            PokemonDbContext context,
            IPokeApiService pokeApiService,
            IInventoryService inventoryService)
        {
            _context = context;
            _pokeApiService = pokeApiService;
            _inventoryService = inventoryService;
        }

        public async Task<PurchaseResultDto> PurchaseItemAsync(string userId, PurchaseItemDto dto)
        {
            var quantity = Math.Clamp(dto.Quantity, 1, MaxQuantityPerPurchase);

            if (dto.ItemApiId <= 0)
            {
                return Fail("Invalid item.");
            }

            // Authoritative price from PokeAPI — never trust a client-sent cost.
            var apiItem = await _pokeApiService.GetItemAsync(dto.ItemApiId);
            if (apiItem == null)
            {
                return Fail("Item not found.");
            }

            var unitCost = apiItem.Cost;
            if (unitCost <= 0)
            {
                return Fail("This item is not for sale.");
            }

            var totalCost = unitCost * quantity;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return Fail("Trainer not found.");
            }

            if (user.Coins < totalCost)
            {
                return new PurchaseResultDto
                {
                    Success = false,
                    Message = "Not enough coins.",
                    UnitCost = unitCost,
                    Quantity = quantity,
                    TotalCost = totalCost,
                    RemainingCoins = user.Coins
                };
            }

            var addDto = new AddItemDto
            {
                ItemApiId = dto.ItemApiId,
                Name = string.IsNullOrWhiteSpace(dto.Name) ? apiItem.Name : dto.Name,
                SpriteUrl = dto.SpriteUrl ?? string.Empty,
                Description = dto.Description,
                ApiPocketName = dto.ApiPocketName,
                CategoryName = dto.CategoryName ?? string.Empty,
                Quantity = quantity,
                IsHoldable = dto.IsHoldable,
                IsConsumable = dto.IsConsumable,
                UsableInBattle = dto.UsableInBattle
            };

            // NpgsqlRetryingExecutionStrategy requires user-initiated transactions to run
            // inside CreateExecutionStrategy so retries can replay the whole unit of work.
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var trainer = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                    if (trainer == null)
                    {
                        return Fail("Trainer not found.");
                    }

                    if (trainer.Coins < totalCost)
                    {
                        return new PurchaseResultDto
                        {
                            Success = false,
                            Message = "Not enough coins.",
                            UnitCost = unitCost,
                            Quantity = quantity,
                            TotalCost = totalCost,
                            RemainingCoins = trainer.Coins
                        };
                    }

                    trainer.Coins -= totalCost;

                    // Shares this scoped DbContext, so the coin change above is persisted in the
                    // same SaveChanges call inside AddOrStackItemAsync and committed atomically.
                    var item = await _inventoryService.AddOrStackItemAsync(userId, addDto);

                    await transaction.CommitAsync();

                    return new PurchaseResultDto
                    {
                        Success = true,
                        Message = $"Purchased {quantity}x {item.Name}.",
                        UnitCost = unitCost,
                        Quantity = quantity,
                        TotalCost = totalCost,
                        RemainingCoins = trainer.Coins,
                        Item = item
                    };
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        private static PurchaseResultDto Fail(string message) => new()
        {
            Success = false,
            Message = message
        };
    }
}
