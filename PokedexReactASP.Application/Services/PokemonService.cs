using AutoMapper;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    public class PokemonService : IPokemonService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PokemonService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PokemonDto>> GetAllPokemonAsync()
        {
            var pokemon = await _unitOfWork.Pokemon.GetAllAsync();
            return _mapper.Map<IEnumerable<PokemonDto>>(pokemon);
        }

        public async Task<PokemonDto?> GetPokemonByIdAsync(int id)
        {
            var pokemon = await _unitOfWork.Pokemon.GetByIdAsync(id);
            return pokemon == null ? null : _mapper.Map<PokemonDto>(pokemon);
        }

        public async Task<PokemonDto> CreatePokemonAsync(CreatePokemonDto createPokemonDto)
        {
            var pokemon = _mapper.Map<Pokemon>(createPokemonDto);
            await _unitOfWork.Pokemon.AddAsync(pokemon);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<PokemonDto>(pokemon);
        }

        public async Task<bool> UpdatePokemonAsync(int id, CreatePokemonDto updatePokemonDto)
        {
            var pokemon = await _unitOfWork.Pokemon.GetByIdAsync(id);
            if (pokemon == null)
            {
                return false;
            }

            _mapper.Map(updatePokemonDto, pokemon);
            _unitOfWork.Pokemon.Update(pokemon);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePokemonAsync(int id)
        {
            var pokemon = await _unitOfWork.Pokemon.GetByIdAsync(id);
            if (pokemon == null)
            {
                return false;
            }

            _unitOfWork.Pokemon.Remove(pokemon);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PokemonDto>> SearchPokemonAsync(string searchTerm)
        {
            var pokemon = await _unitOfWork.Pokemon.FindAsync(p => 
                p.Name.Contains(searchTerm) || 
                p.Type1.Contains(searchTerm) || 
                (p.Type2 != null && p.Type2.Contains(searchTerm)));

            return _mapper.Map<IEnumerable<PokemonDto>>(pokemon);
        }
    }
}
