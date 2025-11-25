using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace PokedexReactASP.Application.Services
{
    /// <summary>
    /// Service for interacting with PokeAPI (https://pokeapi.co/)
    /// This replaces the need to store Pokemon data in the database.
    /// Consider adding caching to reduce API calls.
    /// </summary>
    public interface IPokeApiService
    {
        Task<PokeApiPokemon?> GetPokemonAsync(int id);
        Task<PokeApiPokemon?> GetPokemonAsync(string name);
        Task<PokeApiMove?> GetMoveAsync(int id);
        Task<PokeApiItem?> GetItemAsync(int id);
        Task<PokeApiType?> GetTypeAsync(string typeName);
        Task<List<PokeApiPokemonListItem>> GetPokemonListAsync(int limit = 151, int offset = 0);
    }

    public class PokeApiService : IPokeApiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<PokeApiService> _logger;
        private const string BaseUrl = "https://pokeapi.co/api/v2/";

        public PokeApiService(HttpClient httpClient, ILogger<PokeApiService> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(BaseUrl);
            _logger = logger;
        }

        public async Task<PokeApiPokemon?> GetPokemonAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"pokemon/{id}");
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to fetch Pokemon {PokemonId} from PokeAPI", id);
                    return null;
                }

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<PokeApiPokemon>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Pokemon {PokemonId} from PokeAPI", id);
                return null;
            }
        }

        public async Task<PokeApiPokemon?> GetPokemonAsync(string name)
        {
            try
            {
                var response = await _httpClient.GetAsync($"pokemon/{name.ToLower()}");
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to fetch Pokemon {PokemonName} from PokeAPI", name);
                    return null;
                }

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<PokeApiPokemon>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Pokemon {PokemonName} from PokeAPI", name);
                return null;
            }
        }

        public async Task<PokeApiMove?> GetMoveAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"move/{id}");
                if (!response.IsSuccessStatusCode) return null;

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<PokeApiMove>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Move {MoveId} from PokeAPI", id);
                return null;
            }
        }

        public async Task<PokeApiItem?> GetItemAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"item/{id}");
                if (!response.IsSuccessStatusCode) return null;

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<PokeApiItem>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Item {ItemId} from PokeAPI", id);
                return null;
            }
        }

        public async Task<PokeApiType?> GetTypeAsync(string typeName)
        {
            try
            {
                var response = await _httpClient.GetAsync($"type/{typeName.ToLower()}");
                if (!response.IsSuccessStatusCode) return null;

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<PokeApiType>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Type {TypeName} from PokeAPI", typeName);
                return null;
            }
        }

        public async Task<List<PokeApiPokemonListItem>> GetPokemonListAsync(int limit = 151, int offset = 0)
        {
            try
            {
                var response = await _httpClient.GetAsync($"pokemon?limit={limit}&offset={offset}");
                if (!response.IsSuccessStatusCode) return new List<PokeApiPokemonListItem>();

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<PokeApiPokemonList>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result?.Results ?? new List<PokeApiPokemonListItem>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Pokemon list from PokeAPI");
                return new List<PokeApiPokemonListItem>();
            }
        }
    }

    #region PokeAPI Models

    public class PokeApiPokemon
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Height { get; set; } // in decimetres
        public int Weight { get; set; } // in hectograms
        public int Base_Experience { get; set; }
        public PokeApiSprites? Sprites { get; set; }
        public List<PokeApiType> Types { get; set; } = new();
        public List<PokeApiStat> Stats { get; set; } = new();
        public List<PokeApiAbility> Abilities { get; set; } = new();
        public List<PokeApiMove> Moves { get; set; } = new();
        public PokeApiSpecies? Species { get; set; }

        // Helper properties
        public string Type1 => Types.Count > 0 ? Types[0].Type.Name : string.Empty;
        public string? Type2 => Types.Count > 1 ? Types[1].Type.Name : null;
        public int Hp => Stats.FirstOrDefault(s => s.Stat.Name == "hp")?.Base_Stat ?? 0;
        public int Attack => Stats.FirstOrDefault(s => s.Stat.Name == "attack")?.Base_Stat ?? 0;
        public int Defense => Stats.FirstOrDefault(s => s.Stat.Name == "defense")?.Base_Stat ?? 0;
        public int SpecialAttack => Stats.FirstOrDefault(s => s.Stat.Name == "special-attack")?.Base_Stat ?? 0;
        public int SpecialDefense => Stats.FirstOrDefault(s => s.Stat.Name == "special-defense")?.Base_Stat ?? 0;
        public int Speed => Stats.FirstOrDefault(s => s.Stat.Name == "speed")?.Base_Stat ?? 0;
    }

    public class PokeApiSprites
    {
        public string? Front_Default { get; set; }
        public string? Front_Shiny { get; set; }
        public string? Back_Default { get; set; }
        public string? Back_Shiny { get; set; }
        public PokeApiOtherSprites? Other { get; set; }
    }

    public class PokeApiOtherSprites
    {
        public PokeApiOfficialArtwork? Official_Artwork { get; set; }
    }

    public class PokeApiOfficialArtwork
    {
        public string? Front_Default { get; set; }
        public string? Front_Shiny { get; set; }
    }

    public class PokeApiType
    {
        public int Slot { get; set; }
        public PokeApiNamedResource Type { get; set; } = new();
    }

    public class PokeApiStat
    {
        public int Base_Stat { get; set; }
        public int Effort { get; set; }
        public PokeApiNamedResource Stat { get; set; } = new();
    }

    public class PokeApiAbility
    {
        public bool Is_Hidden { get; set; }
        public int Slot { get; set; }
        public PokeApiNamedResource Ability { get; set; } = new();
    }

    public class PokeApiMove
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? Power { get; set; }
        public int? Pp { get; set; }
        public int? Accuracy { get; set; }
        public PokeApiNamedResource? Type { get; set; }
        public PokeApiNamedResource? Damage_Class { get; set; }
    }

    public class PokeApiItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Cost { get; set; }
        public PokeApiSprites? Sprites { get; set; }
    }

    public class PokeApiSpecies
    {
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class PokeApiNamedResource
    {
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class PokeApiPokemonList
    {
        public int Count { get; set; }
        public string? Next { get; set; }
        public string? Previous { get; set; }
        public List<PokeApiPokemonListItem> Results { get; set; } = new();
    }

    public class PokeApiPokemonListItem
    {
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        
        // Extract ID from URL (e.g., "https://pokeapi.co/api/v2/pokemon/25/" -> 25)
        public int Id => int.TryParse(Url.TrimEnd('/').Split('/').Last(), out var id) ? id : 0;
    }

    #endregion
}
