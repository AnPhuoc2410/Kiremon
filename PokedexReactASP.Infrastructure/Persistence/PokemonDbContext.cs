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

        public DbSet<UserPokemon> UserPokemon { get; set; }
        public DbSet<UserBox> UserBoxes { get; set; } 
        public DbSet<UserItem> UserItems { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }

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
                entity.Property(e => e.Achievements).HasColumnType("text");
                entity.Property(e => e.Badges).HasColumnType("text");
                entity.Property(e => e.FriendCode).HasMaxLength(14).IsRequired();
                entity.HasIndex(e => e.FriendCode).IsUnique();
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
                entity.HasIndex(e => new { e.UserId, e.IsInParty, e.SlotIndex });
                entity.HasIndex(e => e.BoxId);

                // Configure relationship with User
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserPokemons)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Cấu hình quan hệ Box - Pokemon
                entity.HasOne(p => p.Box)
                    .WithMany(b => b.Pokemons)
                    .HasForeignKey(p => p.BoxId)
                    .OnDelete(DeleteBehavior.SetNull);

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

            // Configure UserBox entity
            modelBuilder.Entity<UserBox>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
                entity.Property(e => e.BackgroundImage).HasMaxLength(200);

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Boxes)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure UserItem entity
            modelBuilder.Entity<UserItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => new { e.UserId, e.ItemApiId });
                entity.HasIndex(e => new { e.UserId, e.PocketName });

                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.PocketName).HasMaxLength(50).IsRequired();
                entity.Property(e => e.CategoryName).HasMaxLength(50);
                entity.Property(e => e.SpriteUrl).HasMaxLength(500);

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Inventory)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Friendship entity
            modelBuilder.Entity<Friendship>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Indexes for better query performance
                entity.HasIndex(e => e.User1Id);
                entity.HasIndex(e => e.User2Id);
                entity.HasIndex(e => new { e.User1Id, e.User2Id }).IsUnique();

                // Relationships
                entity.HasOne(e => e.User1)
                    .WithMany(u => u.FriendshipsAsUser1)
                    .HasForeignKey(e => e.User1Id)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.User2)
                    .WithMany(u => u.FriendshipsAsUser2)
                    .HasForeignKey(e => e.User2Id)
                    .OnDelete(DeleteBehavior.Restrict);

                // String length constraints
                entity.Property(e => e.User1NicknameForUser2).HasMaxLength(50);
                entity.Property(e => e.User2NicknameForUser1).HasMaxLength(50);
            });

            // Configure FriendRequest entity
            modelBuilder.Entity<FriendRequest>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Indexes
                entity.HasIndex(e => e.SenderId);
                entity.HasIndex(e => e.ReceiverId);
                entity.HasIndex(e => new { e.SenderId, e.ReceiverId });
                entity.HasIndex(e => e.Status);

                // Relationships
                entity.HasOne(e => e.Sender)
                    .WithMany(u => u.SentFriendRequests)
                    .HasForeignKey(e => e.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Receiver)
                    .WithMany(u => u.ReceivedFriendRequests)
                    .HasForeignKey(e => e.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);

                // String length constraints
                entity.Property(e => e.Message).HasMaxLength(200);
            });
        }
    }
}