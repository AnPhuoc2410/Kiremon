using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.DTOs.TcgCards;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class TcgCardCollectionService : ITcgCardCollectionService
    {
        private const int DefaultPage = 1;
        private const int DefaultPageSize = 30;
        private const int MaxPageSize = 100;

        private readonly PokemonDbContext _context;

        public TcgCardCollectionService(PokemonDbContext context)
        {
            _context = context;
        }

        public async Task<PagedTcgCardsResponseDto> GetMyCardsAsync(string userId, MyTcgCardsQueryDto query)
        {
            var page = query.Page < 1 ? DefaultPage : query.Page;
            var pageSize = query.PageSize < 1 ? DefaultPageSize : Math.Min(query.PageSize, MaxPageSize);

            var cardsQuery = _context.UserTcgCards
                .AsNoTracking()
                .Where(x => x.UserId == userId);

            if (query.PokemonApiId.HasValue)
            {
                cardsQuery = cardsQuery.Where(x => x.PokemonApiId == query.PokemonApiId.Value);
            }

            if (query.RarityTier.HasValue)
            {
                cardsQuery = cardsQuery.Where(x => x.RarityTier == query.RarityTier.Value);
            }

            cardsQuery = ApplySort(cardsQuery, query.Sort);
            var totalCount = await cardsQuery.CountAsync();

            var items = await cardsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new MyTcgCardItemDto
                {
                    UserCardId = x.Id,
                    TcgCardId = x.TcgCardId,
                    PokemonApiId = x.PokemonApiId,
                    Name = x.Name,
                    Rarity = x.Rarity,
                    RarityTier = x.RarityTier.ToString(),
                    Quantity = x.Quantity,
                    ImageSmall = x.ImageSmall,
                    ImageLarge = x.ImageLarge
                })
                .ToListAsync();

            return new PagedTcgCardsResponseDto
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<IReadOnlyList<TcgCardDto>> GetCardsByPokemonPreviewAsync(int pokemonApiId)
        {
            var cards = await _context.TcgCardCaches
                .AsNoTracking()
                .Where(x => x.PokemonApiId == pokemonApiId)
                .OrderByDescending(x => x.RarityTier)
                .ThenBy(x => x.Name)
                .Select(x => new TcgCardDto
                {
                    TcgCardId = x.TcgCardId,
                    PokemonApiId = x.PokemonApiId,
                    Name = x.Name,
                    Supertype = x.Supertype,
                    Rarity = x.Rarity,
                    RarityTier = x.RarityTier,
                    SetId = x.SetId,
                    SetName = x.SetName,
                    ImageSmall = x.ImageSmall,
                    ImageLarge = x.ImageLarge
                })
                .ToListAsync();

            return cards;
        }

        private static IQueryable<Domain.Entities.UserTcgCard> ApplySort(
            IQueryable<Domain.Entities.UserTcgCard> query,
            string? sort)
        {
            var normalized = (sort ?? "obtained-desc").Trim().ToLowerInvariant();

            return normalized switch
            {
                "obtained-asc" => query.OrderBy(x => x.ObtainedAt),
                "rarity-desc" => query.OrderByDescending(x => x.RarityTier).ThenByDescending(x => x.ObtainedAt),
                "rarity-asc" => query.OrderBy(x => x.RarityTier).ThenByDescending(x => x.ObtainedAt),
                _ => query.OrderByDescending(x => x.ObtainedAt)
            };
        }
    }
}
