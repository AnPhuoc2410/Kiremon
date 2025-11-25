using AutoMapper;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    /// <summary>
    /// UPDATED: PokemonService now uses PokeAPI instead of database.
    /// This service fetches Pokemon data from PokeAPI on-demand.
    /// </summary>
    public class PokemonService : IPokemonService
    {
        private readonly IPokeApiService _pokeApiService;
        private readonly IMapper _mapper;

        public PokemonService(IPokeApiService pokeApiService, IMapper mapper)
        {
            _pokeApiService = pokeApiService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PokemonDto>> GetAllPokemonAsync()
        {
            // Fetch Pokemon list from PokeAPI (default: first 151)
            var pokemonList = await _pokeApiService.GetPokemonListAsync(151, 0);
            var pokemonDtos = new List<PokemonDto>();

            foreach (var item in pokemonList)
            {
                var pokemon = await _pokeApiService.GetPokemonAsync(item.Id);
                if (pokemon != null)
                {
                    pokemonDtos.Add(MapPokeApiToPokemonDto(pokemon));
                }
            }

            return pokemonDtos;
        }

        public async Task<PokemonDto?> GetPokemonByIdAsync(int id)
        {
            var pokemon = await _pokeApiService.GetPokemonAsync(id);
            return pokemon == null ? null : MapPokeApiToPokemonDto(pokemon);
        }

        public async Task<PokemonDto> CreatePokemonAsync(CreatePokemonDto createPokemonDto)
        {
            throw new NotSupportedException("Creating Pokemon is not supported. Pokemon data comes from PokeAPI.");
        }

        public async Task<bool> UpdatePokemonAsync(int id, CreatePokemonDto updatePokemonDto)
        {
            throw new NotSupportedException("Updating Pokemon is not supported. Pokemon data comes from PokeAPI.");
        }

        public async Task<bool> DeletePokemonAsync(int id)
        {
            throw new NotSupportedException("Deleting Pokemon is not supported. Pokemon data comes from PokeAPI.");
        }

        public async Task<IEnumerable<PokemonDto>> SearchPokemonAsync(string searchTerm)
        {
            // For search, we need to fetch and filter
            // This is inefficient but necessary without a database
            // Consider caching or using a search service
            var allPokemon = await GetAllPokemonAsync();
            return allPokemon.Where(p => 
                p.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                p.Type1.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                (p.Type2 != null && p.Type2.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)));
        }

        private PokemonDto MapPokeApiToPokemonDto(PokeApiPokemon pokemon)
        {
            return new PokemonDto
            {
                Id = pokemon.Id,
                Name = pokemon.Name,
                Type1 = pokemon.Type1,
                Type2 = pokemon.Type2,
                Height = pokemon.Height,
                Weight = pokemon.Weight,
                ImageUrl = pokemon.Sprites?.Front_Default ?? string.Empty,
                Description = string.Empty, // PokeAPI doesn't provide description in main endpoint
                BaseExperience = pokemon.Base_Experience,
                Category = string.Empty, // Would need species endpoint
                Abilities = string.Join(", ", pokemon.Abilities.Select(a => a.Ability.Name)),
                Hp = pokemon.Hp,
                Attack = pokemon.Attack,
                Defense = pokemon.Defense,
                SpecialAttack = pokemon.SpecialAttack,
                SpecialDefense = pokemon.SpecialDefense,
                Speed = pokemon.Speed
            };
        }
    }
}
