using PokedexReactASP.Application.DTOs.Pokemon;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IPokemonService
    {
        Task<IEnumerable<PokemonDto>> GetAllPokemonAsync();
        Task<PokemonDto?> GetPokemonByIdAsync(int id);
        Task<PokemonDto> CreatePokemonAsync(CreatePokemonDto createPokemonDto);
        Task<bool> UpdatePokemonAsync(int id, CreatePokemonDto updatePokemonDto);
        Task<bool> DeletePokemonAsync(int id);
        Task<IEnumerable<PokemonDto>> SearchPokemonAsync(string searchTerm);
    }
}
