using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class PokemonNewsService : IPokemonNewsService
    {
        private readonly PokemonDbContext _context;

        public PokemonNewsService(PokemonDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PokemonNews>> GetLatestNewsAsync(int limit = 10)
        {
            return await _context.PokemonNews
                .OrderByDescending(n => n.PublishedDate)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<bool> IncrementViewCountAsync(int id)
        {
            var news = await _context.PokemonNews.FindAsync(id);
            if (news == null) return false;

            news.ViewCount++;
            _context.PokemonNews.Update(news);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
