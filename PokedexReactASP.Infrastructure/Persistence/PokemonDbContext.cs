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

        // Removed Pokemon DbSet - Pokemon data comes from PokeAPI
        public DbSet<UserPokemon> UserPokemon { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure ApplicationUser entity
            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.FirstName).HasMaxLength(50);
                entity.Property(e => e.LastName).HasMaxLength(50);
                entity.Property(e => e.AvatarUrl).HasMaxLength(500);
                entity.Property(e => e.Bio).HasMaxLength(500);
                entity.Property(e => e.FavoriteType).HasMaxLength(20);
                entity.Property(e => e.CurrentRegion).HasMaxLength(50);
                entity.Property(e => e.CurrentLocation).HasMaxLength(100);
                entity.Property(e => e.Achievements).HasColumnType("nvarchar(max)");
                entity.Property(e => e.Badges).HasColumnType("nvarchar(max)");
            });

            // Configure UserPokemon entity
            modelBuilder.Entity<UserPokemon>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Indexes for better query performance
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.PokemonApiId);
                entity.HasIndex(e => new { e.UserId, e.PokemonApiId });
                entity.HasIndex(e => new { e.UserId, e.IsFavorite });

                // Configure relationship with User
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserPokemons)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // String length constraints
                entity.Property(e => e.Nickname).HasMaxLength(50);
                entity.Property(e => e.CaughtLocation).HasMaxLength(100);
                entity.Property(e => e.CustomMoveIds).HasMaxLength(100);
                entity.Property(e => e.OriginalTrainerId).HasMaxLength(450);
                entity.Property(e => e.OriginalTrainerName).HasMaxLength(100);
                entity.Property(e => e.Notes).HasMaxLength(1000);

                // Required fields
                entity.Property(e => e.UserId).IsRequired();
                entity.Property(e => e.PokemonApiId).IsRequired();
                entity.Property(e => e.CaughtDate).IsRequired();
                
            });
        }
    }
}