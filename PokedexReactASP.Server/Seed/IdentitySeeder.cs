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
    }
}

