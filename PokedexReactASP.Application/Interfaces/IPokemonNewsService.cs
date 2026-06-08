using System.Collections.Generic;
using System.Threading.Tasks;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IPokemonNewsService
    {
        Task<IEnumerable<PokemonNews>> GetLatestNewsAsync(int limit = 10);
        Task<bool> IncrementViewCountAsync(int id);
    }
}
