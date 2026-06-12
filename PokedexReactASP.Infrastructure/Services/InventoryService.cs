using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.Common.Helpers;
using PokedexReactASP.Application.DTOs.Inventory;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    /// <summary>
    /// Bag / inventory service. Items are fungible and stacked by (UserId, ItemApiId).
    /// Follows the same query-side conventions as <see cref="TcgCardCollectionService"/>.
    /// </summary>
    public class InventoryService : IInventoryService
    {
        private const int DefaultPage = 1;
        private const int DefaultPageSize = 30;
        private const int MaxPageSize = 100;

        private readonly PokemonDbContext _context;
        private readonly PokeItemMapper _itemMapper;

        public InventoryService(PokemonDbContext context, PokeItemMapper itemMapper)
        {
            _context = context;
            _itemMapper = itemMapper;
        }

        public async Task<PagedInventoryResponseDto> GetMyItemsAsync(string userId, MyInventoryQueryDto query)
        {
            var page = query.Page < 1 ? DefaultPage : query.Page;
            var pageSize = query.PageSize < 1 ? DefaultPageSize : Math.Min(query.PageSize, MaxPageSize);

            var baseQuery = _context.UserItems
                .AsNoTracking()
                .Where(x => x.UserId == userId);

            var categorySummaries = await baseQuery
                .Where(x => x.CategoryName != string.Empty)
                .GroupBy(x => x.CategoryName)
                .Select(g => new InventoryCategorySummaryDto
                {
                    CategoryName = g.Key,
                    StackCount = g.Count(),
                    TotalQuantity = g.Sum(x => x.Quantity)
                })
                .OrderBy(x => x.CategoryName)
                .ToListAsync();

            var itemsQuery = baseQuery;

            if (!string.IsNullOrWhiteSpace(query.PocketName))
            {
                var pocket = query.PocketName.Trim();
                itemsQuery = itemsQuery.Where(x => x.PocketName == pocket);
            }

            if (!string.IsNullOrWhiteSpace(query.CategoryName))
            {
                var category = query.CategoryName.Trim();
                itemsQuery = itemsQuery.Where(x => x.CategoryName == category);
            }

            itemsQuery = ApplySort(itemsQuery, query.Sort);
            var totalCount = await itemsQuery.CountAsync();

            var items = await itemsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(ToDto)
                .ToListAsync();

            return new PagedInventoryResponseDto
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                Categories = categorySummaries
            };
        }

        public async Task<UserItemDto?> GetItemAsync(string userId, int userItemId)
        {
            return await _context.UserItems
                .AsNoTracking()
                .Where(x => x.UserId == userId && x.Id == userItemId)
                .Select(ToDto)
                .FirstOrDefaultAsync();
        }

        public async Task<UserItemDto> AddOrStackItemAsync(string userId, AddItemDto dto)
        {
            if (dto.Quantity < 1)
            {
                dto.Quantity = 1;
            }

            var existing = await _context.UserItems
                .FirstOrDefaultAsync(x => x.UserId == userId && x.ItemApiId == dto.ItemApiId);

            if (existing != null)
            {
                existing.Quantity += dto.Quantity;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                existing = new UserItem
                {
                    UserId = userId,
                    ItemApiId = dto.ItemApiId,
                    Name = dto.Name,
                    SpriteUrl = dto.SpriteUrl,
                    Description = dto.Description,
                    PocketName = _itemMapper.ResolvePocket(dto.ApiPocketName ?? string.Empty, dto.CategoryName),
                    CategoryName = dto.CategoryName,
                    Quantity = dto.Quantity,
                    IsHoldable = dto.IsHoldable,
                    IsConsumable = dto.IsConsumable,
                    UsableInBattle = dto.UsableInBattle,
                    UpdatedAt = DateTime.UtcNow
                };
                await _context.UserItems.AddAsync(existing);
            }

            await _context.SaveChangesAsync();
            return MapToDto(existing);
        }

        public async Task<UserItemDto?> ConsumeItemAsync(string userId, int userItemId, int quantity)
        {
            if (quantity < 1)
            {
                quantity = 1;
            }

            var item = await _context.UserItems
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == userItemId);

            if (item == null)
            {
                return null;
            }

            item.Quantity -= quantity;

            if (item.Quantity <= 0)
            {
                _context.UserItems.Remove(item);
                await _context.SaveChangesAsync();
                return null;
            }

            item.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return MapToDto(item);
        }

        private static IQueryable<UserItem> ApplySort(IQueryable<UserItem> query, string? sort)
        {
            var normalized = (sort ?? "updated-desc").Trim().ToLowerInvariant();

            return normalized switch
            {
                "name-asc" => query.OrderBy(x => x.Name),
                "name-desc" => query.OrderByDescending(x => x.Name),
                "qty-desc" => query.OrderByDescending(x => x.Quantity).ThenBy(x => x.Name),
                "qty-asc" => query.OrderBy(x => x.Quantity).ThenBy(x => x.Name),
                _ => query.OrderByDescending(x => x.UpdatedAt)
            };
        }

        private static readonly Expression<Func<UserItem, UserItemDto>> ToDto = x => new UserItemDto
        {
            Id = x.Id,
            ItemApiId = x.ItemApiId,
            Name = x.Name,
            SpriteUrl = x.SpriteUrl,
            Description = x.Description,
            PocketName = x.PocketName,
            CategoryName = x.CategoryName,
            Quantity = x.Quantity,
            IsHoldable = x.IsHoldable,
            IsConsumable = x.IsConsumable,
            UsableInBattle = x.UsableInBattle,
            UpdatedAt = x.UpdatedAt
        };

        private static UserItemDto MapToDto(UserItem x) => new()
        {
            Id = x.Id,
            ItemApiId = x.ItemApiId,
            Name = x.Name,
            SpriteUrl = x.SpriteUrl,
            Description = x.Description,
            PocketName = x.PocketName,
            CategoryName = x.CategoryName,
            Quantity = x.Quantity,
            IsHoldable = x.IsHoldable,
            IsConsumable = x.IsConsumable,
            UsableInBattle = x.UsableInBattle,
            UpdatedAt = x.UpdatedAt
        };
    }
}
