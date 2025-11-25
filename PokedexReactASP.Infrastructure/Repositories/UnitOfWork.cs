using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PokemonDbContext _context;
        private IRepository<Pokemon>? _pokemonRepository;
        private IRepository<UserPokemon>? _userPokemonRepository;

        public UnitOfWork(PokemonDbContext context)
        {
            _context = context;
        }

        public IRepository<Pokemon> Pokemon
        {
            get
            {
                return _pokemonRepository ??= new Repository<Pokemon>(_context);
            }
        }

        public IRepository<UserPokemon> UserPokemon
        {
            get
            {
                return _userPokemonRepository ??= new Repository<UserPokemon>(_context);
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
