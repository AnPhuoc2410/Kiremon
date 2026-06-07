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

                    HttpResponseMessage? response = null;
                    const int maxRetries = 3;
                    var retryCount = 0;
                    var delay = TimeSpan.FromSeconds(2);

                    while (true)
                    {
                        try
                        {
                            response = await _httpClient.GetAsync(url, cancellationToken);

                            if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests || 
                                ((int)response.StatusCode >= 500 && (int)response.StatusCode <= 599))
                            {
                                if (retryCount < maxRetries)
                                {
                                    retryCount++;
                                    _logger.LogWarning("Pokemon TCG API returned status code {StatusCode}. Retrying {RetryCount}/{MaxRetries} after {Delay}ms...", 
                                        response.StatusCode, retryCount, maxRetries, delay.TotalMilliseconds);
                                    
                                    response.Dispose();
                                    await Task.Delay(delay, cancellationToken);
                                    delay = TimeSpan.FromSeconds(Math.Min(delay.TotalSeconds * 2, 10)); // Exponential backoff
                                    continue;
                                }
                            }
                            break;
                        }
                        catch (Exception ex) when (ex is OperationCanceledException or HttpRequestException)
                        {
                            // If user requested cancellation, propagate it immediately
                            if (cancellationToken.IsCancellationRequested)
                            {
                                throw;
                            }

                            if (retryCount < maxRetries)
                            {
                                retryCount++;
                                _logger.LogWarning(ex, "Transient error or timeout querying Pokemon TCG API. Retrying {RetryCount}/{MaxRetries} after {Delay}ms...", 
                                    retryCount, maxRetries, delay.TotalMilliseconds);
                                
                                await Task.Delay(delay, cancellationToken);
                                delay = TimeSpan.FromSeconds(Math.Min(delay.TotalSeconds * 2, 10)); // Exponential backoff
                                continue;
                            }
                            throw;
                        }
                    }

                    using (response)
                    {
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
