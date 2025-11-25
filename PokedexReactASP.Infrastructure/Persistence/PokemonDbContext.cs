using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Infrastructure.Persistence
{
    public class PokemonDbContext : IdentityDbContext<ApplicationUser>
    {
        public PokemonDbContext(DbContextOptions<PokemonDbContext> options) : base(options)
        {
        }

        public DbSet<Pokemon> Pokemon { get; set; }
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
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Category).HasMaxLength(100);
                entity.Property(e => e.Abilities).HasMaxLength(500);
                
                entity.HasIndex(e => e.Name);
            });

            // Configure ApplicationUser entity
            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.FirstName).HasMaxLength(50);
                entity.Property(e => e.LastName).HasMaxLength(50);
                entity.Property(e => e.AvatarUrl).HasMaxLength(500);
            });

            // Configure UserPokemon (many-to-many) entity
            modelBuilder.Entity<UserPokemon>(entity =>
            {
                // Composite primary key
                entity.HasKey(e => new { e.UserId, e.PokemonId });

                // Configure relationships
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserPokemons)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Pokemon)
                    .WithMany(p => p.UserPokemons)
                    .HasForeignKey(e => e.PokemonId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.Nickname).HasMaxLength(50);
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
                    ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                    Description = "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokemon.",
                    BaseExperience = 64,
                    Category = "Seed Pokemon",
                    Hp = 45,
                    Attack = 49,
                    Defense = 49,
                    SpecialAttack = 65,
                    SpecialDefense = 65,
                    Speed = 45
                },
                new Pokemon
                {
                    Id = 4,
                    Name = "Charmander",
                    Type1 = "Fire",
                    Type2 = null,
                    Height = 6,
                    Weight = 85,
                    ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
                    Description = "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
                    BaseExperience = 62,
                    Category = "Lizard Pokemon",
                    Hp = 39,
                    Attack = 52,
                    Defense = 43,
                    SpecialAttack = 60,
                    SpecialDefense = 50,
                    Speed = 65
                },
                new Pokemon
                {
                    Id = 7,
                    Name = "Squirtle",
                    Type1 = "Water",
                    Type2 = null,
                    Height = 5,
                    Weight = 90,
                    ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
                    Description = "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
                    BaseExperience = 63,
                    Category = "Tiny Turtle Pokemon",
                    Hp = 44,
                    Attack = 48,
                    Defense = 65,
                    SpecialAttack = 50,
                    SpecialDefense = 64,
                    Speed = 43
                },
                new Pokemon
                {
                    Id = 25,
                    Name = "Pikachu",
                    Type1 = "Electric",
                    Type2 = null,
                    Height = 4,
                    Weight = 60,
                    ImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
                    Description = "When several of these Pokemon gather, their electricity could build and cause lightning storms.",
                    BaseExperience = 112,
                    Category = "Mouse Pokemon",
                    Hp = 35,
                    Attack = 55,
                    Defense = 40,
                    SpecialAttack = 50,
                    SpecialDefense = 50,
                    Speed = 90
                }
            );
        }
    }
}