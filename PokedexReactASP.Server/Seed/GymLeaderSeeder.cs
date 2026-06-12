using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Server.Seed
{
    public static class GymLeaderSeeder
    {
        public static async Task SeedAsync(PokemonDbContext context, ILogger logger)
        {
            try
            {
                if (await context.GymLeaders.AnyAsync()) return;

                var leaders = new List<GymLeader>
                {
                    new GymLeader
                    {
                        Id = "kanto_badge_brock",
                        Name = "Brock",
                        BadgeName = "Boulder Badge",
                        Region = "Kanto",
                        Avatar = "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
                        Sprite = "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
                        RosterJson = """
                        [
                          {
                            "name": "Geodude",
                            "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
                            "types": ["rock", "ground"],
                            "level": 12,
                            "base_experience": 60,
                            "stats": {
                              "hp": 80,
                              "attack": 30,
                              "defense": 35,
                              "special_attack": 15,
                              "special_defense": 15,
                              "speed": 12
                            },
                            "moves": [
                              { "name": "Tackle", "power": 40, "type": "normal" },
                              { "name": "Defense Curl", "power": 0, "type": "normal" },
                              { "name": "Rock Throw", "power": 50, "type": "rock" },
                              { "name": "Mud-Slap", "power": 20, "type": "ground" }
                            ]
                          },
                          {
                            "name": "Onix",
                            "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png",
                            "types": ["rock", "ground"],
                            "level": 14,
                            "base_experience": 77,
                            "stats": {
                              "hp": 95,
                              "attack": 32,
                              "defense": 45,
                              "special_attack": 18,
                              "special_defense": 20,
                              "speed": 24
                            },
                            "moves": [
                              { "name": "Tackle", "power": 40, "type": "normal" },
                              { "name": "Screech", "power": 0, "type": "normal" },
                              { "name": "Bind", "power": 15, "type": "normal" },
                              { "name": "Rock Tomb", "power": 60, "type": "rock" }
                            ]
                          }
                        ]
                        """
                    },
                    new GymLeader
                    {
                        Id = "kanto_badge_misty",
                        Name = "Misty",
                        BadgeName = "Cascade Badge",
                        Region = "Kanto",
                        Avatar = "https://play.pokemonshowdown.com/sprites/trainers/misty.png",
                        Sprite = "https://play.pokemonshowdown.com/sprites/trainers/misty.png",
                        RosterJson = """
                        [
                          {
                            "name": "Staryu",
                            "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png",
                            "types": ["water"],
                            "level": 18,
                            "base_experience": 68,
                            "stats": {
                              "hp": 90,
                              "attack": 35,
                              "defense": 38,
                              "special_attack": 42,
                              "special_defense": 38,
                              "speed": 45
                            },
                            "moves": [
                              { "name": "Tackle", "power": 40, "type": "normal" },
                              { "name": "Water Pulse", "power": 60, "type": "water" },
                              { "name": "Swift", "power": 60, "type": "normal" }
                            ]
                          },
                          {
                            "name": "Starmie",
                            "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png",
                            "types": ["water", "psychic"],
                            "level": 21,
                            "base_experience": 182,
                            "stats": {
                              "hp": 125,
                              "attack": 50,
                              "defense": 55,
                              "special_attack": 65,
                              "special_defense": 55,
                              "speed": 68
                            },
                            "moves": [
                              { "name": "Swift", "power": 60, "type": "normal" },
                              { "name": "Water Pulse", "power": 60, "type": "water" },
                              { "name": "Recover", "power": 0, "type": "normal" },
                              { "name": "Bubble Beam", "power": 65, "type": "water" }
                            ]
                          }
                        ]
                        """
                    },
                    new GymLeader
                    {
                        Id = "kanto_badge_lt_surge",
                        Name = "Lt. Surge",
                        BadgeName = "Thunder Badge",
                        Region = "Kanto",
                        Avatar = "https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png",
                        Sprite = "https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png",
                        RosterJson = """
                        [
                          {
                            "name": "Voltorb",
                            "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png",
                            "types": ["electric"],
                            "level": 21,
                            "base_experience": 66,
                            "stats": {
                              "hp": 95,
                              "attack": 38,
                              "defense": 42,
                              "special_attack": 45,
                              "special_defense": 45,
                              "speed": 65
                            },
                            "moves": [
                              { "name": "Tackle", "power": 40, "type": "normal" },
                              { "name": "Spark", "power": 65, "type": "electric" }
                            ]
                          },
                          {
                            "name": "Pikachu",
                            "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
                            "types": ["electric"],
                            "level": 21,
                            "base_experience": 112,
                            "stats": {
                              "hp": 92,
                              "attack": 45,
                              "defense": 38,
                              "special_attack": 42,
                              "special_defense": 38,
                              "speed": 62
                            },
                            "moves": [
                              { "name": "Quick Attack", "power": 40, "type": "normal" },
                              { "name": "Thunderbolt", "power": 90, "type": "electric" }
                            ]
                          },
                          {
                            "name": "Raichu",
                            "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
                            "types": ["electric"],
                            "level": 24,
                            "base_experience": 218,
                            "stats": {
                              "hp": 135,
                              "attack": 65,
                              "defense": 52,
                              "special_attack": 68,
                              "special_defense": 60,
                              "speed": 78
                            },
                            "moves": [
                              { "name": "Thunderbolt", "power": 90, "type": "electric" },
                              { "name": "Quick Attack", "power": 40, "type": "normal" },
                              { "name": "Double Kick", "power": 30, "type": "fighting" }
                            ]
                          }
                        ]
                        """
                    }
                };

                await context.GymLeaders.AddRangeAsync(leaders);
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded Gym Leaders successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding gym leaders.");
            }
        }
    }
}
