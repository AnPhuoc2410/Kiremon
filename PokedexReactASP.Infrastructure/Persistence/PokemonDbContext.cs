using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Infrastructure.Persistence
{
    public class PokemonDbContext : DbContext
    {
        public PokemonDbContext(DbContextOptions<PokemonDbContext> options) : base(options)
        {
        }

        public DbSet<Pokemon> Pokemon { get; set; }
        public DbSet<Trainer> Trainers { get; set; }
        public DbSet<UserPokemon> UserPokemon { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Pokemon entity
            modelBuilder.Entity<Pokemon>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Type1).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Type2).HasMaxLength(50);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // Configure Trainer entity
            modelBuilder.Entity<Trainer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.DateJoined).IsRequired();
                
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure UserPokemon (many-to-many) entity
            modelBuilder.Entity<UserPokemon>(entity =>
            {
                // Composite primary key
                entity.HasKey(e => new { e.TrainerId, e.PokemonId });

                // Configure relationships
                entity.HasOne(e => e.Trainer)
                    .WithMany(e => e.UserPokemons)
                    .HasForeignKey(e => e.TrainerId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Pokemon)
                    .WithMany(e => e.UserPokemons)
                    .HasForeignKey(e => e.PokemonId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.CaughtDate).IsRequired();
            });

            // Seed some initial Pokemon data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pokemon>().HasData(
                new Pokemon
                {
                    Id = 1,
                    Name = "Bulbasaur",
                    Type1 = "Grass",
                    Type2 = "Poison",
                    Height = 7,
                    Weight = 69,
                    Level = 5,
                    ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
                },
                new Pokemon
                {
                    Id = 4,
                    Name = "Charmander",
                    Type1 = "Fire",
                    Type2 = null,
                    Height = 6,
                    Weight = 85,
                    Level = 5,
                    ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
                },
                new Pokemon
                {
                    Id = 7,
                    Name = "Squirtle",
                    Type1 = "Water",
                    Type2 = null,
                    Height = 5,
                    Weight = 90,
                    Level = 5,
                    ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
                },
                new Pokemon
                {
                    Id = 25,
                    Name = "Pikachu",
                    Type1 = "Electric",
                    Type2 = null,
                    Height = 4,
                    Weight = 60,
                    Level = 5,
                    ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
                }
            );
        }
    }
}