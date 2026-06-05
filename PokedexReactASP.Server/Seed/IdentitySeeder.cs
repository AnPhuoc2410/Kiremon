using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Server.Seed
{
    public static class IdentitySeeder
    {
        public static async Task SeedAsync(IServiceProvider services, IConfiguration configuration, bool isDevelopment, ILogger logger)
        {
            using var scope = services.CreateScope();
            var provider = scope.ServiceProvider;

            var context = provider.GetRequiredService<PokemonDbContext>();
            var userManager = provider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = provider.GetRequiredService<RoleManager<IdentityRole>>();

            try
            {
                if (isDevelopment && context.Database.GetPendingMigrations().Any())
                {
                    logger.LogInformation("Find Changes Migrations, Updating Database...");
                    context.Database.Migrate();
                }

                await SeedRoles(roleManager);
                await SeedAdminUser(configuration, userManager, roleManager, logger);
                await SeedAchievements(context, logger);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while migrating or seeding the database.");
            }
        }

        private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Admin", "User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        private static async Task SeedAdminUser(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ILogger logger)
        {
            var adminSection = configuration.GetSection("SeedAdmin");
            var email = adminSection["Email"];
            var username = adminSection["Username"] ?? email;
            var tempPassword = adminSection["Password"];

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(tempPassword))
            {
                logger.LogInformation("SeedAdmin is not configured. Skipping admin seeding.");
                return;
            }

            var existing = await userManager.FindByEmailAsync(email);
            if (existing != null)
            {
                await EnsureAdminRole(existing, userManager, roleManager);
                return;
            }

            var adminUser = new ApplicationUser
            {
                Email = email,
                UserName = username,
                EmailConfirmed = true,
                FirstName = "Admin",
                LastName = "Seed"
            };

            var createResult = await userManager.CreateAsync(adminUser, tempPassword);
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                logger.LogError("Failed to seed admin user: {Errors}", errors);
                return;
            }

            await EnsureAdminRole(adminUser, userManager, roleManager);
            logger.LogInformation("Seeded admin user {Email} with temporary password.", email);
        }

        private static async Task EnsureAdminRole(
            ApplicationUser user,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            if (!await userManager.IsInRoleAsync(user, "Admin"))
            {
                await userManager.AddToRoleAsync(user, "Admin");
            }
        }

        private static async Task SeedAchievements(PokemonDbContext context, ILogger logger)
        {
            try
            {
                var defaultAchievements = PokedexReactASP.Application.Services.AchievementService.DefaultAchievements;
                bool changes = false;
                
                foreach (var achievement in defaultAchievements)
                {
                    var existing = await context.Achievements.FirstOrDefaultAsync(a => a.Id == achievement.Id);
                    if (existing == null)
                    {
                        await context.Achievements.AddAsync(new Achievement
                        {
                            Id = achievement.Id,
                            Name = achievement.Name,
                            Description = achievement.Description,
                            Category = achievement.Category,
                            Rarity = achievement.Rarity,
                            TargetValue = achievement.TargetValue,
                            RewardCoins = achievement.RewardCoins,
                            Icon = achievement.Icon,
                            Region = achievement.Region
                        });
                        changes = true;
                    }
                    else
                    {
                        if (existing.Name != achievement.Name ||
                            existing.Description != achievement.Description ||
                            existing.Category != achievement.Category ||
                            existing.Rarity != achievement.Rarity ||
                            existing.TargetValue != achievement.TargetValue ||
                            existing.RewardCoins != achievement.RewardCoins ||
                            existing.Icon != achievement.Icon ||
                            existing.Region != achievement.Region)
                        {
                            existing.Name = achievement.Name;
                            existing.Description = achievement.Description;
                            existing.Category = achievement.Category;
                            existing.Rarity = achievement.Rarity;
                            existing.TargetValue = achievement.TargetValue;
                            existing.RewardCoins = achievement.RewardCoins;
                            existing.Icon = achievement.Icon;
                            existing.Region = achievement.Region;
                            
                            context.Achievements.Update(existing);
                            changes = true;
                        }
                    }
                }
                
                if (changes)
                {
                    await context.SaveChangesAsync();
                    logger.LogInformation("Achievements and region badges seeded/updated successfully.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding achievements.");
            }
        }
    }
}

