using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class BiomeSpawnCandidateService
    {
        private static readonly WildSpawnRarity[] RarityOrder =
        [
            WildSpawnRarity.Common,
            WildSpawnRarity.Uncommon,
            WildSpawnRarity.Rare,
            WildSpawnRarity.Epic,
            WildSpawnRarity.Legendary
        ];

        private readonly PokemonDbContext _context;

        public BiomeSpawnCandidateService(PokemonDbContext context)
        {
            _context = context;
        }

        public async Task<List<BiomeSpawnCandidate>> GetCandidatesWithFallbackAsync(
            WildAreaConfig area,
            WildAreaSettings settings,
            WildSpawnRarity rarity,
            CancellationToken cancellationToken = default)
        {
            foreach (var candidateRarity in GetFallbackOrder(rarity))
            {
                if (candidateRarity == WildSpawnRarity.Legendary && !area.ResolveAllowLegendary(settings))
                {
                    continue;
                }

                var candidates = await GetScoredCandidatesAsync(area, settings, candidateRarity, relaxRequiredRules: false, includeRejected: false, cancellationToken);
                if (candidates.Count > 0)
                {
                    return candidates;
                }
            }

            var relaxed = await GetScoredCandidatesAsync(area, settings, rarity, relaxRequiredRules: true, includeRejected: false, cancellationToken);
            if (relaxed.Count > 0)
            {
                return relaxed;
            }

            return await GetSafeFallbackCandidatesAsync(area, settings, cancellationToken);
        }

        public async Task<List<BiomeSpawnCandidate>> GetDebugCandidatesAsync(
            WildAreaConfig area,
            WildAreaSettings settings,
            WildSpawnRarity rarity,
            CancellationToken cancellationToken = default)
        {
            var candidates = await GetScoredCandidatesAsync(area, settings, rarity, relaxRequiredRules: false, includeRejected: true, cancellationToken);

            return candidates
                .OrderBy(x => x.Rejected)
                .ThenByDescending(x => x.Score)
                .ThenBy(x => x.Pokemon.PokemonApiId)
                .Take(100)
                .ToList();
        }

        private async Task<List<BiomeSpawnCandidate>> GetScoredCandidatesAsync(
            WildAreaConfig area,
            WildAreaSettings settings,
            WildSpawnRarity rarity,
            bool relaxRequiredRules,
            bool includeRejected,
            CancellationToken cancellationToken)
        {
            var pokemons = await _context.PokemonSpawnMetadata
                .AsNoTracking()
                .Where(p => p.IsDefaultForm)
                .Where(p => p.SpawnRarity == rarity)
                .Where(p => p.Generation >= area.ResolveMinGeneration())
                .Where(p => p.Generation <= area.ResolveMaxGeneration(settings))
                .Where(p => area.ResolveAllowLegendary(settings) || !p.IsLegendary)
                .Where(p => area.ResolveAllowMythical() || !p.IsMythical)
                .Where(p => area.ResolveAllowBaby() || !p.IsBaby)
                .ToListAsync(cancellationToken);

            var candidates = await BuildCandidatesAsync(pokemons, cancellationToken);

            foreach (var candidate in candidates)
            {
                EvaluateCandidate(candidate, area, relaxRequiredRules);
            }

            return includeRejected
                ? candidates
                : candidates.Where(x => !x.Rejected && x.Score > 0).ToList();
        }

        private async Task<List<BiomeSpawnCandidate>> GetSafeFallbackCandidatesAsync(
            WildAreaConfig area,
            WildAreaSettings settings,
            CancellationToken cancellationToken)
        {
            if (area.SafeFallbackPokemonIds.Count == 0)
            {
                return [];
            }

            var pokemons = await _context.PokemonSpawnMetadata
                .AsNoTracking()
                .Where(p => area.SafeFallbackPokemonIds.Contains(p.PokemonApiId))
                .Where(p => p.IsDefaultForm)
                .Where(p => p.Generation >= area.ResolveMinGeneration())
                .Where(p => p.Generation <= area.ResolveMaxGeneration(settings))
                .Where(p => area.ResolveAllowLegendary(settings) || !p.IsLegendary)
                .Where(p => area.ResolveAllowMythical() || !p.IsMythical)
                .Where(p => area.ResolveAllowBaby() || !p.IsBaby)
                .ToListAsync(cancellationToken);

            var candidates = await BuildCandidatesAsync(pokemons, cancellationToken);

            foreach (var candidate in candidates)
            {
                EvaluateCandidate(candidate, area, relaxRequiredRules: true);
                if (!candidate.Rejected)
                {
                    candidate.Score = Math.Max(candidate.Score, 1.0);
                    candidate.AcceptedReasons.Add("Safe fallback candidate");
                }
            }

            return candidates.Where(x => !x.Rejected && x.Score > 0).ToList();
        }

        private async Task<List<BiomeSpawnCandidate>> BuildCandidatesAsync(
            IReadOnlyCollection<PokemonSpawnMetadata> pokemons,
            CancellationToken cancellationToken)
        {
            if (pokemons.Count == 0)
            {
                return [];
            }

            var ids = pokemons.Select(x => x.PokemonApiId).ToList();
            var tagRows = await _context.PokemonBiomeTags
                .AsNoTracking()
                .Where(x => ids.Contains(x.PokemonApiId))
                .ToListAsync(cancellationToken);

            var tagsByPokemon = tagRows
                .GroupBy(x => x.PokemonApiId)
                .ToDictionary(x => x.Key, x => x.ToList());

            return pokemons
                .Select(pokemon => new BiomeSpawnCandidate
                {
                    Pokemon = pokemon,
                    Tags = tagsByPokemon.TryGetValue(pokemon.PokemonApiId, out var tags) ? tags : []
                })
                .ToList();
        }

        private static void EvaluateCandidate(BiomeSpawnCandidate candidate, WildAreaConfig area, bool relaxRequiredRules)
        {
            candidate.Score = 0;
            candidate.Rejected = false;
            candidate.AcceptedReasons.Clear();
            candidate.RejectedReasons.Clear();

            var types = candidate.Types.ToHashSet(StringComparer.OrdinalIgnoreCase);
            var tagWeights = candidate.Tags
                .GroupBy(x => Normalize(x.Tag))
                .ToDictionary(x => x.Key, x => x.Max(t => t.Weight), StringComparer.OrdinalIgnoreCase);
            var tagNames = tagWeights.Keys.ToHashSet(StringComparer.OrdinalIgnoreCase);

            var bannedTypeMatches = area.NormalizedBannedTypes.Where(types.Contains).ToList();
            if (bannedTypeMatches.Count > 0)
            {
                Reject(candidate, $"Banned type matched: {string.Join(", ", bannedTypeMatches)}");
            }

            var bannedTagMatches = area.NormalizedBannedTags.Where(tagNames.Contains).ToList();
            if (bannedTagMatches.Count > 0)
            {
                Reject(candidate, $"Banned tag matched: {string.Join(", ", bannedTagMatches)}");
            }

            if (!relaxRequiredRules)
            {
                if (area.NormalizedRequiredAnyTags.Count > 0 && !area.NormalizedRequiredAnyTags.Any(tagNames.Contains))
                {
                    Reject(candidate, $"Missing required tags: {string.Join(", ", area.NormalizedRequiredAnyTags)}");
                }

                if (area.NormalizedRequiredAnyTypes.Count > 0 &&
                    !area.NormalizedRequiredAnyTypes.Any(types.Contains) &&
                    !area.NormalizedSecondaryAllowedTypes.Any(types.Contains))
                {
                    Reject(candidate, $"Missing required types: {string.Join(", ", area.NormalizedRequiredAnyTypes)}");
                }
            }

            if (candidate.Rejected)
            {
                return;
            }

            var score = Math.Max(candidate.Pokemon.SpawnWeight, 0.01);

            foreach (var type in types)
            {
                if (area.NormalizedRequiredAnyTypes.Contains(type))
                {
                    score += 4.0;
                    candidate.AcceptedReasons.Add($"Required type: {type} +4");
                }

                if (area.NormalizedSecondaryAllowedTypes.Contains(type))
                {
                    score += 1.5;
                    candidate.AcceptedReasons.Add($"Secondary allowed type: {type} +1.5");
                }
            }

            foreach (var tag in tagWeights)
            {
                if (area.NormalizedRequiredAnyTags.Contains(tag.Key))
                {
                    candidate.AcceptedReasons.Add($"Required tag matched: {tag.Key}");
                }

                if (area.NormalizedPreferredTags.Contains(tag.Key))
                {
                    var bonus = 5.0 * tag.Value;
                    score += bonus;
                    candidate.AcceptedReasons.Add($"Preferred tag: {tag.Key} +{bonus:0.##}");
                }

                if (area.NormalizedAllowedTags.Contains(tag.Key))
                {
                    var bonus = 1.5 * tag.Value;
                    score += bonus;
                    candidate.AcceptedReasons.Add($"Allowed tag: {tag.Key} +{bonus:0.##}");
                }
            }

            candidate.Score = Math.Max(score, 0);
        }

        private static void Reject(BiomeSpawnCandidate candidate, string reason)
        {
            candidate.Rejected = true;
            candidate.Score = 0;
            candidate.RejectedReasons.Add(reason);
        }

        private static List<WildSpawnRarity> GetFallbackOrder(WildSpawnRarity rarity)
        {
            var index = Array.IndexOf(RarityOrder, rarity);
            if (index < 0)
            {
                return RarityOrder.ToList();
            }

            var order = new List<WildSpawnRarity> { rarity };

            for (var i = index - 1; i >= 0; i--)
            {
                order.Add(RarityOrder[i]);
            }

            for (var i = index + 1; i < RarityOrder.Length; i++)
            {
                order.Add(RarityOrder[i]);
            }

            return order;
        }

        private static string Normalize(string value)
        {
            return value.Trim().ToLowerInvariant();
        }
    }

    public class BiomeSpawnCandidate
    {
        public PokemonSpawnMetadata Pokemon { get; init; } = null!;
        public List<PokemonBiomeTag> Tags { get; init; } = [];
        public double Score { get; set; }
        public bool Rejected { get; set; }
        public List<string> AcceptedReasons { get; } = [];
        public List<string> RejectedReasons { get; } = [];

        public List<string> Types
        {
            get
            {
                var types = new List<string>();

                if (!string.IsNullOrWhiteSpace(Pokemon.PrimaryType))
                {
                    types.Add(Pokemon.PrimaryType.Trim().ToLowerInvariant());
                }

                if (!string.IsNullOrWhiteSpace(Pokemon.SecondaryType))
                {
                    types.Add(Pokemon.SecondaryType.Trim().ToLowerInvariant());
                }

                return types;
            }
        }
    }
}
