using System.Threading;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IPokemonNewsSyncService
    {
        Task<PokemonNewsSyncResultDto> SyncNewsAsync(CancellationToken cancellationToken = default);
    }

    public class PokemonNewsSyncResultDto
    {
        public int TotalScraped { get; set; }
        public int Inserted { get; set; }
        public int Updated { get; set; }
        public int Failed { get; set; }
    }
}
