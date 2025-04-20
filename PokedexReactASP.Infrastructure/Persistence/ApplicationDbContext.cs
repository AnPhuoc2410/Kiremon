using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Trainer> Trainers { get; set; }
        public DbSet<Pokemon> Pokemons { get; set; }
        public DbSet<UserPokemon> UserPokemons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the composite primary key for the UserPokemon join entity
            modelBuilder.Entity<UserPokemon>()
                .HasKey(up => new { up.TrainerId, up.PokemonId });

            // Configure the many-to-many relationship between User and Pokemon
            // through the UserPokemon join entity
            modelBuilder.Entity<UserPokemon>()
                .HasOne(up => up.Trainer)
                .WithMany(u => u.UserPokemons)
                .HasForeignKey(up => up.TrainerId);

            modelBuilder.Entity<UserPokemon>()
                .HasOne(up => up.Pokemon)
                .WithMany(p => p.UserPokemons)
                .HasForeignKey(up => up.PokemonId);

            // Seed initial data
            modelBuilder.Entity<Pokemon>().HasData(
                new Pokemon { Id = 1, Name = "Bulbasaur", Type1 = "Grass", Type2 = "Poison", ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", Height = 7, Weight = 69, Level = 5 },
                new Pokemon { Id = 2, Name = "Ivysaur", Type1 = "Grass", Type2 = "Poison", ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png", Height = 10, Weight = 130, Level = 16 }
                // Add more Pokemon data here
            );
        }
    }
}
