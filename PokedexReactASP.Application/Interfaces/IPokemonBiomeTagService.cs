using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IPokemonBiomeTagService
    {
        Task<PokemonBiomeTagRegenerationResultDto> RegenerateTagsAsync(
            bool clearAuto = true,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyList<WildAreaCandidateDebugDto>> GetCandidateDebugAsync(
            string areaCode,
            WildSpawnRarity rarity,
            CancellationToken cancellationToken = default);
    }

    public class PokemonBiomeTagRegenerationResultDto
    {
        public int PokemonScanned { get; set; }
        public int AutoTagsDeleted { get; set; }
        public int AutoTagsInserted { get; set; }
        public int ManualTagsUpserted { get; set; }
        public int Skipped { get; set; }
    }

    public class WildAreaCandidateDebugDto
    {
        public int PokemonApiId { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<string> Types { get; set; } = new();
        public List<string> Tags { get; set; } = new();
        public double Score { get; set; }
        public bool Rejected { get; set; }
        public List<string> AcceptedReasons { get; set; } = new();
        public List<string> RejectedReasons { get; set; } = new();
    }
}
