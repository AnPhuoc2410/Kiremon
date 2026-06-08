using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PokemonDbContext _context;

        private IRepository<UserPokemon>?   _userPokemonRepository;
        private IRepository<Friendship>?    _friendshipRepository;
        private IRepository<FriendRequest>? _friendRequestRepository;
        private IRepository<UserItem>?      _userItemRepository;
        private IRepository<UserBox>?       _userBoxRepository;
        private IRepository<Achievement>?    _achievementRepository;
        private IRepository<UserAchievement>? _userAchievementRepository;

        public UnitOfWork(PokemonDbContext context)
        {
            _context = context;
        }

        public IRepository<UserPokemon> UserPokemon =>
            _userPokemonRepository ??= new Repository<UserPokemon>(_context);

        public IRepository<Friendship> Friendship =>
            _friendshipRepository ??= new Repository<Friendship>(_context);

        public IRepository<FriendRequest> FriendRequest =>
            _friendRequestRepository ??= new Repository<FriendRequest>(_context);

        /// <inheritdoc/>
        public IRepository<UserItem> UserItem =>
            _userItemRepository ??= new Repository<UserItem>(_context);

        /// <inheritdoc/>
        public IRepository<UserBox> UserBox =>
            _userBoxRepository ??= new Repository<UserBox>(_context);

        public IRepository<Achievement> Achievement =>
            _achievementRepository ??= new Repository<Achievement>(_context);

        public IRepository<UserAchievement> UserAchievement =>
            _userAchievementRepository ??= new Repository<UserAchievement>(_context);

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
