using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PokemonDbContext _context;

        private IRepository<UserPokemon>? _userPokemonRepository;
        private IRepository<Friendship>? _friendshipRepository;
        private IRepository<FriendRequest>? _friendRequestRepository;

        public UnitOfWork(PokemonDbContext context)
        {
            _context = context;
        }

        public IRepository<UserPokemon> UserPokemon
        {
            get
            {
                return _userPokemonRepository ??= new Repository<UserPokemon>(_context);
            }
        }

        public IRepository<Friendship> Friendship
        {
            get
            {
                return _friendshipRepository ??= new Repository<Friendship>(_context);
            }
        }

        public IRepository<FriendRequest> FriendRequest
        {
            get
            {
                return _friendRequestRepository ??= new Repository<FriendRequest>(_context);
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
