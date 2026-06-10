using PokedexReactASP.Domain.Entities;
using System.Linq.Expressions;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync(bool disableTracking = false);

        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, bool disableTracking = false);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, bool disableTracking = false);

        Task<IEnumerable<T>> FindAsync(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IQueryable<T>>? includes,
            bool disableTracking = false);

        Task<T?> FirstOrDefaultAsync(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IQueryable<T>>? includes,
            bool disableTracking = false);

        Task AddAsync(T entity);
        void Update(T entity);
        void Remove(T entity);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
        Task<int> CountAsync(Expression<Func<T, bool>> predicate);
    }

    public interface IUnitOfWork : IDisposable
    {
        IRepository<UserPokemon> UserPokemon { get; }
        IRepository<Friendship> Friendship { get; }
        IRepository<FriendRequest> FriendRequest { get; }
        IRepository<UserItem> UserItem { get; }
        IRepository<UserBox> UserBox { get; }
        IRepository<Achievement> Achievement { get; }
        IRepository<UserAchievement> UserAchievement { get; }
        IRepository<RefreshToken> RefreshToken { get; }
        Task<int> SaveChangesAsync();
    }
}
