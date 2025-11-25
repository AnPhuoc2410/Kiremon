using PokedexReactASP.Domain.Entities;
using System.Linq.Expressions;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        void Update(T entity);
        void Remove(T entity);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
    }

    public interface IUnitOfWork : IDisposable
    {
        // Removed: Pokemon repository - Pokemon data comes from PokeAPI
        // IRepository<Pokemon> Pokemon { get; }
        IRepository<UserPokemon> UserPokemon { get; }
        Task<int> SaveChangesAsync();
    }
}
