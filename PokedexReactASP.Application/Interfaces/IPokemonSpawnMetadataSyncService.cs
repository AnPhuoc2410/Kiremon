namespace PokedexReactASP.Application.Interfaces
{
    public interface IPokemonSpawnMetadataSyncService
    {
        Task<PokemonSpawnMetadataSyncResultDto> SyncAsync(bool force = false, CancellationToken cancellationToken = default);
    }

    public class PokemonSpawnMetadataSyncResultDto
    {
        public int Scanned { get; set; }
        public int Inserted { get; set; }
        public int Updated { get; set; }
        public int Skipped { get; set; }
        public int Failed { get; set; }
    }
}
