using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace PokedexReactASP.Infrastructure.ExternalApis
{
    public interface IPokemonTcgApiClient
    {
        Task<IReadOnlyList<PokemonTcgCardApiModel>> SearchCardsByPokemonAsync(int pokemonApiId, CancellationToken cancellationToken = default);
    }

    public class PokemonTcgApiClient : IPokemonTcgApiClient
    {
        private const int PageSize = 250;
        private const string SelectFields = "id,name,supertype,rarity,nationalPokedexNumbers,images,set";

        private readonly HttpClient _httpClient;
        private readonly ILogger<PokemonTcgApiClient> _logger;

        public PokemonTcgApiClient(HttpClient httpClient, ILogger<PokemonTcgApiClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<IReadOnlyList<PokemonTcgCardApiModel>> SearchCardsByPokemonAsync(int pokemonApiId, CancellationToken cancellationToken = default)
        {
            var cards = new List<PokemonTcgCardApiModel>();
            var page = 1;
            var totalCount = int.MaxValue;

            try
            {
                while ((page - 1) * PageSize < totalCount)
                {
                    var query = $"nationalPokedexNumbers:{pokemonApiId} supertype:Pokémon";
                    var encodedQuery = Uri.EscapeDataString(query);
                    var encodedSelect = Uri.EscapeDataString(SelectFields);
                    var url = $"cards?q={encodedQuery}&page={page}&pageSize={PageSize}&select={encodedSelect}";

                    using var response = await _httpClient.GetAsync(url, cancellationToken);
                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.LogWarning("Pokemon TCG API returned status code {StatusCode} for pokemonApiId {PokemonApiId}", response.StatusCode, pokemonApiId);
                        return Array.Empty<PokemonTcgCardApiModel>();
                    }

                    await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
                    var payload = await JsonSerializer.DeserializeAsync<PokemonTcgSearchResponse>(stream, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }, cancellationToken);

                    if (payload?.Data == null || payload.Data.Count == 0)
                    {
                        break;
                    }

                    cards.AddRange(payload.Data.Where(c => !string.IsNullOrWhiteSpace(c.Id)));
                    totalCount = payload.TotalCount <= 0 ? cards.Count : payload.TotalCount;
                    page++;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error querying Pokemon TCG API for pokemonApiId {PokemonApiId}", pokemonApiId);
                return Array.Empty<PokemonTcgCardApiModel>();
            }

            return cards;
        }
    }

    public class PokemonTcgSearchResponse
    {
        public List<PokemonTcgCardApiModel> Data { get; set; } = new();
        public int TotalCount { get; set; }
    }

    public class PokemonTcgCardApiModel
    {
        public string Id { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? Supertype { get; set; }
        public string? Rarity { get; set; }
        public int[]? NationalPokedexNumbers { get; set; }
        public PokemonTcgImageApiModel? Images { get; set; }
        public PokemonTcgSetApiModel? Set { get; set; }
    }

    public class PokemonTcgImageApiModel
    {
        public string? Small { get; set; }
        public string? Large { get; set; }
    }

    public class PokemonTcgSetApiModel
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
    }
}
