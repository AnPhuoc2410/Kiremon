using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.DTOs.Achievement;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;
using System.Text.Json;

namespace PokedexReactASP.Application.Services
{
    public class AchievementService : IAchievementService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDistributedCache _cache;
        private readonly IAchievementNotificationService _notificationService;
        private readonly ILogger<AchievementService> _logger;

        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(24);

        // Predefined list of achievements and region gym badges
        public static readonly List<Achievement> DefaultAchievements = new()
        {
            // General progression
            new Achievement { Id = "level_5", Name = "Novice Trainer", Description = "Reach Trainer Level 5", Category = "Progression", Rarity = "Bronze", TargetValue = 5, RewardCoins = 100, Icon = "star-level-5" },
            new Achievement { Id = "level_10", Name = "Rising Star", Description = "Reach Trainer Level 10", Category = "Progression", Rarity = "Bronze", TargetValue = 10, RewardCoins = 200, Icon = "star-level-10" },
            new Achievement { Id = "level_20", Name = "Ace Trainer", Description = "Reach Trainer Level 20", Category = "Progression", Rarity = "Silver", TargetValue = 20, RewardCoins = 500, Icon = "star-level-20" },
            new Achievement { Id = "level_30", Name = "Grandmaster", Description = "Reach Trainer Level 30", Category = "Progression", Rarity = "Gold", TargetValue = 30, RewardCoins = 1000, Icon = "star-level-30" },

            // General collection
            new Achievement { Id = "catch_10", Name = "First Steps", Description = "Catch 10 Pokémon", Category = "Collection", Rarity = "Bronze", TargetValue = 10, RewardCoins = 100, Icon = "catch-10" },
            new Achievement { Id = "catch_50", Name = "Collector", Description = "Catch 50 Pokémon", Category = "Collection", Rarity = "Silver", TargetValue = 50, RewardCoins = 300, Icon = "catch-50" },
            new Achievement { Id = "catch_100", Name = "Super Catcher", Description = "Catch 100 Pokémon", Category = "Collection", Rarity = "Silver", TargetValue = 100, RewardCoins = 500, Icon = "catch-100" },
            new Achievement { Id = "catch_500", Name = "Catching Master", Description = "Catch 500 Pokémon", Category = "Collection", Rarity = "Gold", TargetValue = 500, RewardCoins = 1500, Icon = "catch-500" },

            // Species diversity
            new Achievement { Id = "unique_10", Name = "Species Researcher", Description = "Register 10 unique Pokémon species in your Pokédex", Category = "Collection", Rarity = "Bronze", TargetValue = 10, RewardCoins = 150, Icon = "unique-10" },
            new Achievement { Id = "unique_50", Name = "Pokédex Enthusiast", Description = "Register 50 unique Pokémon species in your Pokédex", Category = "Collection", Rarity = "Silver", TargetValue = 50, RewardCoins = 400, Icon = "unique-50" },
            new Achievement { Id = "unique_100", Name = "Professor's Assistant", Description = "Register 100 unique Pokémon species in your Pokédex", Category = "Collection", Rarity = "Gold", TargetValue = 100, RewardCoins = 800, Icon = "unique-100" },

            // Shinies & Legendaries
            new Achievement { Id = "shiny_1", Name = "Lucky Find", Description = "Catch your first Shiny Pokémon", Category = "Collection", Rarity = "Silver", TargetValue = 1, RewardCoins = 500, Icon = "shiny-1" },
            new Achievement { Id = "shiny_5", Name = "Sparkle Catcher", Description = "Catch 5 Shiny Pokémon", Category = "Collection", Rarity = "Gold", TargetValue = 5, RewardCoins = 1000, Icon = "shiny-5" },
            new Achievement { Id = "legendary_1", Name = "Myth Defier", Description = "Catch your first Legendary Pokémon", Category = "Collection", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "legendary-1" },

            // Social
            new Achievement { Id = "friends_1", Name = "Friendly Encounter", Description = "Add your first friend", Category = "Social", Rarity = "Bronze", TargetValue = 1, RewardCoins = 100, Icon = "friends-1" },
            new Achievement { Id = "friends_5", Name = "Social Butterfly", Description = "Have 5 friends", Category = "Social", Rarity = "Silver", TargetValue = 5, RewardCoins = 300, Icon = "friends-5" },
            new Achievement { Id = "friends_10", Name = "Popular Trainer", Description = "Have 10 friends", Category = "Social", Rarity = "Gold", TargetValue = 10, RewardCoins = 500, Icon = "friends-10" },

            // Kanto Region Badges (Gym Leaders)
            new Achievement { Id = "kanto_badge_brock", Name = "Boulder Badge", Description = "Defeat Gym Leader Brock in Pewter City (Kanto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-1", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_misty", Name = "Cascade Badge", Description = "Defeat Gym Leader Misty in Cerulean City (Kanto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-2", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_lt_surge", Name = "Thunder Badge", Description = "Defeat Gym Leader Lt. Surge in Vermilion City (Kanto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-3", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_erika", Name = "Rainbow Badge", Description = "Defeat Gym Leader Erika in Celadon City (Kanto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-4", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_koga", Name = "Soul Badge", Description = "Defeat Gym Leader Koga in Fuchsia City (Kanto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-5", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_sabrina", Name = "Marsh Badge", Description = "Defeat Gym Leader Sabrina in Saffron City (Kanto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-6", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_blaine", Name = "Volcano Badge", Description = "Defeat Gym Leader Blaine in Cinnabar Island (Kanto)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-7", Region = "Kanto" },
            new Achievement { Id = "kanto_badge_giovanni", Name = "Earth Badge", Description = "Defeat Gym Leader Giovanni in Viridian City (Kanto)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-8", Region = "Kanto" },

            // Johto Region Badges (Gym Leaders)
            new Achievement { Id = "johto_badge_falkner", Name = "Zephyr Badge", Description = "Defeat Gym Leader Falkner in Violet City (Johto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-9", Region = "Johto" },
            new Achievement { Id = "johto_badge_bugsy", Name = "Hive Badge", Description = "Defeat Gym Leader Bugsy in Azalea Town (Johto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-10", Region = "Johto" },
            new Achievement { Id = "johto_badge_whitney", Name = "Plain Badge", Description = "Defeat Gym Leader Whitney in Goldenrod City (Johto)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-11", Region = "Johto" },
            new Achievement { Id = "johto_badge_morty", Name = "Fog Badge", Description = "Defeat Gym Leader Morty in Ecruteak City (Johto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-12", Region = "Johto" },
            new Achievement { Id = "johto_badge_chuck", Name = "Storm Badge", Description = "Defeat Gym Leader Chuck in Cianwood City (Johto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-13", Region = "Johto" },
            new Achievement { Id = "johto_badge_jasmine", Name = "Mineral Badge", Description = "Defeat Gym Leader Jasmine in Olivine City (Johto)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-14", Region = "Johto" },
            new Achievement { Id = "johto_badge_pryce", Name = "Glacier Badge", Description = "Defeat Gym Leader Pryce in Mahogany Town (Johto)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-15", Region = "Johto" },
            new Achievement { Id = "johto_badge_clair", Name = "Rising Badge", Description = "Defeat Gym Leader Clair in Blackthorn City (Johto)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-16", Region = "Johto" },

            // Hoenn Region Badges (Gym Leaders)
            new Achievement { Id = "hoenn_badge_roxanne", Name = "Stone Badge", Description = "Defeat Gym Leader Roxanne in Rustboro City (Hoenn)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-17", Region = "Hoenn" },
            new Achievement { Id = "hoenn_badge_brawly", Name = "Knuckle Badge", Description = "Defeat Gym Leader Brawly in Dewford Town (Hoenn)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-18", Region = "Hoenn" },
            new Achievement { Id = "hoenn_badge_wattson", Name = "Dynamo Badge", Description = "Defeat Gym Leader Wattson in Mauville City (Hoenn)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-19", Region = "Hoenn" },
            new Achievement { Id = "hoenn_badge_flannery", Name = "Heat Badge", Description = "Defeat Gym Leader Flannery in Lavaridge Town (Hoenn)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-20", Region = "Hoenn" },
            new Achievement { Id = "hoenn_badge_norman", Name = "Balance Badge", Description = "Defeat Gym Leader Norman in Petalburg City (Hoenn)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-21", Region = "Hoenn" },
            new Achievement { Id = "hoenn_badge_winona", Name = "Feather Badge", Description = "Defeat Gym Leader Winona in Fortree City (Hoenn)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-22", Region = "Hoenn" },
            new Achievement { Id = "hoenn_badge_tate_liza", Name = "Mind Badge", Description = "Defeat Gym Leaders Tate & Liza in Mossdeep City (Hoenn)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-23", Region = "Hoenn" },
            new Achievement { Id = "hoenn_badge_wallace", Name = "Rain Badge", Description = "Defeat Gym Leader Wallace in Sootopolis City (Hoenn)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-24", Region = "Hoenn" },

            // Sinnoh Region Badges (Gym Leaders)
            new Achievement { Id = "sinnoh_badge_roark", Name = "Coal Badge", Description = "Defeat Gym Leader Roark in Oreburgh City (Sinnoh)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-25", Region = "Sinnoh" },
            new Achievement { Id = "sinnoh_badge_gardenia", Name = "Forest Badge", Description = "Defeat Gym Leader Gardenia in Eterna City (Sinnoh)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-26", Region = "Sinnoh" },
            new Achievement { Id = "sinnoh_badge_maylene", Name = "Cobble Badge", Description = "Defeat Gym Leader Maylene in Veilstone City (Sinnoh)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-27", Region = "Sinnoh" },
            new Achievement { Id = "sinnoh_badge_wake", Name = "Fen Badge", Description = "Defeat Gym Leader Crasher Wake in Pastoria City (Sinnoh)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-28", Region = "Sinnoh" },
            new Achievement { Id = "sinnoh_badge_fantina", Name = "Relic Badge", Description = "Defeat Gym Leader Fantina in Hearthome City (Sinnoh)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-29", Region = "Sinnoh" },
            new Achievement { Id = "sinnoh_badge_byron", Name = "Mine Badge", Description = "Defeat Gym Leader Byron in Canalave City (Sinnoh)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-30", Region = "Sinnoh" },
            new Achievement { Id = "sinnoh_badge_candice", Name = "Icicle Badge", Description = "Defeat Gym Leader Candice in Snowpoint City (Sinnoh)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-31", Region = "Sinnoh" },
            new Achievement { Id = "sinnoh_badge_volkner", Name = "Beacon Badge", Description = "Defeat Gym Leader Volkner in Sunyshore City (Sinnoh)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-32", Region = "Sinnoh" },

            // Unova Region Badges (Gym Leaders)
            new Achievement { Id = "unova_badge_trio", Name = "Trio Badge", Description = "Defeat Gym Leaders Cilan, Chili, or Cress in Striaton City (Unova)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-33", Region = "Unova" },
            new Achievement { Id = "unova_badge_basic", Name = "Basic Badge", Description = "Defeat Gym Leader Cheren or Lenora in Nacrene/Aspertia City (Unova)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-34", Region = "Unova" },
            new Achievement { Id = "unova_badge_toxic", Name = "Toxic Badge", Description = "Defeat Gym Leader Roxie in Virbank City (Unova)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-35", Region = "Unova" },
            new Achievement { Id = "unova_badge_burgh", Name = "Insect Badge", Description = "Defeat Gym Leader Burgh in Castelia City (Unova)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-36", Region = "Unova" },
            new Achievement { Id = "unova_badge_elesa", Name = "Bolt Badge", Description = "Defeat Gym Leader Elesa in Nimbasa City (Unova)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-37", Region = "Unova" },
            new Achievement { Id = "unova_badge_clay", Name = "Quake Badge", Description = "Defeat Gym Leader Clay in Driftveil City (Unova)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-38", Region = "Unova" },
            new Achievement { Id = "unova_badge_skyla", Name = "Jet Badge", Description = "Defeat Gym Leader Skyla in Mistralton City (Unova)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-39", Region = "Unova" },
            new Achievement { Id = "unova_badge_brycen", Name = "Freeze Badge", Description = "Defeat Gym Leader Brycen in Icirrus City (Unova)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-40", Region = "Unova" },
            new Achievement { Id = "unova_badge_drayden", Name = "Legend Badge", Description = "Defeat Gym Leader Drayden or Iris in Opelucid City (Unova)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-41", Region = "Unova" },
            new Achievement { Id = "unova_badge_marlon", Name = "Wave Badge", Description = "Defeat Gym Leader Marlon in Humilau City (Unova)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-42", Region = "Unova" },

            // Kalos Region Badges (Gym Leaders)
            new Achievement { Id = "kalos_badge_viola", Name = "Bug Badge", Description = "Defeat Gym Leader Viola in Santalune City (Kalos)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-43", Region = "Kalos" },
            new Achievement { Id = "kalos_badge_grant", Name = "Cliff Badge", Description = "Defeat Gym Leader Grant in Cyllage City (Kalos)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-44", Region = "Kalos" },
            new Achievement { Id = "kalos_badge_korrina", Name = "Rumble Badge", Description = "Defeat Gym Leader Korrina in Shalour City (Kalos)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-45", Region = "Kalos" },
            new Achievement { Id = "kalos_badge_ramos", Name = "Plant Badge", Description = "Defeat Gym Leader Ramos in Coumarine City (Kalos)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-46", Region = "Kalos" },
            new Achievement { Id = "kalos_badge_clemont", Name = "Voltage Badge", Description = "Defeat Gym Leader Clemont in Lumiose City (Kalos)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-47", Region = "Kalos" },
            new Achievement { Id = "kalos_badge_valerie", Name = "Fairy Badge", Description = "Defeat Gym Leader Valerie in Laverre City (Kalos)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-48", Region = "Kalos" },
            new Achievement { Id = "kalos_badge_olympia", Name = "Psychic Badge", Description = "Defeat Gym Leader Olympia in Anistar City (Kalos)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-49", Region = "Kalos" },
            new Achievement { Id = "kalos_badge_wulfric", Name = "Iceberg Badge", Description = "Defeat Gym Leader Wulfric in Snowbelle City (Kalos)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-50", Region = "Kalos" },

            // Galar Region Badges (Gym Leaders)
            new Achievement { Id = "galar_badge_milo", Name = "Grass Badge", Description = "Defeat Gym Leader Milo in Turffield (Galar)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-51", Region = "Galar" },
            new Achievement { Id = "galar_badge_nessa", Name = "Water Badge", Description = "Defeat Gym Leader Nessa in Hulbury (Galar)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-52", Region = "Galar" },
            new Achievement { Id = "galar_badge_kabu", Name = "Fire Badge", Description = "Defeat Gym Leader Kabu in Motostoke (Galar)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-53", Region = "Galar" },
            new Achievement { Id = "galar_badge_bea", Name = "Fighting Badge", Description = "Defeat Gym Leader Bea in Stow-on-Side (Galar)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-54", Region = "Galar" },
            new Achievement { Id = "galar_badge_allister", Name = "Ghost Badge", Description = "Defeat Gym Leader Allister in Stow-on-Side (Galar)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-55", Region = "Galar" },
            new Achievement { Id = "galar_badge_opal", Name = "Fairy Badge", Description = "Defeat Gym Leader Opal in Ballonlea (Galar)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-56", Region = "Galar" },
            new Achievement { Id = "galar_badge_gordie", Name = "Rock Badge", Description = "Defeat Gym Leader Gordie in Circhester (Galar)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-57", Region = "Galar" },
            new Achievement { Id = "galar_badge_melony", Name = "Ice Badge", Description = "Defeat Gym Leader Melony in Circhester (Galar)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-58", Region = "Galar" },
            new Achievement { Id = "galar_badge_piers", Name = "Dark Badge", Description = "Defeat Gym Leader Piers in Spikemuth (Galar)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-59", Region = "Galar" },
            new Achievement { Id = "galar_badge_raihan", Name = "Dragon Badge", Description = "Defeat Gym Leader Raihan in Hammerlocke (Galar)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-60", Region = "Galar" },

            // Paldea Region Badges (Gym Leaders, Team Star, Titans)
            new Achievement { Id = "paldea_badge_katy", Name = "Bug Badge", Description = "Defeat Gym Leader Katy in Cortondo (Paldea)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-61", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_brassius", Name = "Grass Badge", Description = "Defeat Gym Leader Brassius in Artazon (Paldea)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-62", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_iono", Name = "Electric Badge", Description = "Defeat Gym Leader Iono in Levincia (Paldea)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 600, Icon = "badge-63", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_kofu", Name = "Water Badge", Description = "Defeat Gym Leader Kofu in Cascarrafa (Paldea)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-64", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_larry", Name = "Normal Badge", Description = "Defeat Gym Leader Larry in Medali (Paldea)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-65", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_ryme", Name = "Ghost Badge", Description = "Defeat Gym Leader Ryme in Montenevera (Paldea)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 900, Icon = "badge-66", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_tulip", Name = "Psychic Badge", Description = "Defeat Gym Leader Tulip in Alfornada (Paldea)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-67", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_grusha", Name = "Ice Badge", Description = "Defeat Gym Leader Grusha in Glaseado (Paldea)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1200, Icon = "badge-68", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_giacomo", Name = "Segin Star Badge", Description = "Defeat Team Star Dark Crew Boss Giacomo (Paldea)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-69", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_mela", Name = "Schedar Star Badge", Description = "Defeat Team Star Fire Crew Boss Mela (Paldea)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-70", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_atticus", Name = "Navi Star Badge", Description = "Defeat Team Star Poison Crew Boss Atticus (Paldea)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-71", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_ortega", Name = "Ruchbah Star Badge", Description = "Defeat Team Star Fairy Crew Boss Ortega (Paldea)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 800, Icon = "badge-72", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_eri", Name = "Caph Star Badge", Description = "Defeat Team Star Fighting Crew Boss Eri (Paldea)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-73", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_stony_cliff_titan", Name = "Stony Cliff Titan Badge", Description = "Defeat the Stony Cliff Titan Klawf (Paldea)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-74", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_open_sky_titan", Name = "Open Sky Titan Badge", Description = "Defeat the Open Sky Titan Bombirdier (Paldea)", Category = "Badges", Rarity = "Bronze", TargetValue = 1, RewardCoins = 500, Icon = "badge-75", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_lurking_steel_titan", Name = "Lurking Steel Titan Badge", Description = "Defeat the Lurking Steel Titan Orthworm (Paldea)", Category = "Badges", Rarity = "Silver", TargetValue = 1, RewardCoins = 700, Icon = "badge-76", Region = "Paldea" },
            new Achievement { Id = "paldea_badge_quaking_earth_titan", Name = "Quaking Earth Titan Badge", Description = "Defeat the Quaking Earth or False Dragon Titans (Paldea)", Category = "Badges", Rarity = "Gold", TargetValue = 1, RewardCoins = 1000, Icon = "badge-77", Region = "Paldea" },
        };

        public AchievementService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            IDistributedCache cache,
            IAchievementNotificationService notificationService,
            ILogger<AchievementService> logger)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _cache = cache;
            _notificationService = notificationService;
            _logger = logger;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<UserAchievementStatusDto>> GetUserAchievementsAsync(string userId)
        {
            var cacheKey = $"achievements:{userId}";

            // 1. Try cache lookup
            string? cachedJson = null;
            try
            {
                cachedJson = await _cache.GetStringAsync(cacheKey);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to read achievements cache for user {UserId} from Redis. Falling back to DB.", userId);
            }

            if (!string.IsNullOrEmpty(cachedJson))
            {
                try
                {
                    return JsonSerializer.Deserialize<List<UserAchievementStatusDto>>(cachedJson) ?? new List<UserAchievementStatusDto>();
                }
                catch (JsonException)
                {
                    // Fallback to database query on corrupted cache
                }
            }

            // 2. Fetch from DB
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Enumerable.Empty<UserAchievementStatusDto>();

            var userAchievementsList = await _unitOfWork.UserAchievement.FindAsync(ua => ua.UserId == userId, disableTracking: true);
            var userAchievements = userAchievementsList.ToDictionary(ua => ua.AchievementId);

            var result = new List<UserAchievementStatusDto>();

            foreach (var definition in DefaultAchievements)
            {
                var hasProgress = userAchievements.TryGetValue(definition.Id, out var record);

                int progress = 0;
                bool isUnlocked = false;
                DateTime? unlockedAt = null;

                if (hasProgress && record != null)
                {
                    progress = record.Progress;
                    isUnlocked = record.IsUnlocked;
                    unlockedAt = record.UnlockedAt;
                }
                else
                {
                    // Dynamically calculate progress for stats-based achievements if not recorded in DB
                    progress = CalculateStatProgress(user, definition);
                    isUnlocked = progress >= definition.TargetValue;
                    if (isUnlocked)
                    {
                        unlockedAt = DateTime.UtcNow;
                    }
                }

                result.Add(new UserAchievementStatusDto
                {
                    Id = definition.Id,
                    Name = definition.Name,
                    Description = definition.Description,
                    Category = definition.Category,
                    Rarity = definition.Rarity,
                    CurrentProgress = progress,
                    TargetValue = definition.TargetValue,
                    IsUnlocked = isUnlocked,
                    UnlockedAt = unlockedAt,
                    RewardCoins = definition.RewardCoins,
                    Icon = definition.Icon,
                    Region = definition.Region
                });
            }

            // 3. Save to Redis
            try
            {
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = CacheDuration
                };
                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to save achievements cache for user {UserId} to Redis.", userId);
            }

            return result;
        }

        /// <inheritdoc/>
        public async Task CheckAndUnlockAchievementsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return;

            var userAchievementsList = await _unitOfWork.UserAchievement.FindAsync(ua => ua.UserId == userId);
            var userAchievements = userAchievementsList.ToDictionary(ua => ua.AchievementId);

            bool anyNewUnlock = false;

            foreach (var definition in DefaultAchievements)
            {
                // Skip manually triggered regional badges
                if (definition.Category == "Badges") continue;

                var hasProgress = userAchievements.TryGetValue(definition.Id, out var record);
                if (record != null && record.IsUnlocked) continue;

                int currentProgress = CalculateStatProgress(user, definition);

                if (record == null)
                {
                    record = new UserAchievement
                    {
                        UserId = userId,
                        AchievementId = definition.Id,
                        Progress = currentProgress,
                        IsUnlocked = false
                    };
                    await _unitOfWork.UserAchievement.AddAsync(record);
                }
                else
                {
                    record.Progress = currentProgress;
                }

                if (record.Progress >= definition.TargetValue && !record.IsUnlocked)
                {
                    record.IsUnlocked = true;
                    record.UnlockedAt = DateTime.UtcNow;
                    anyNewUnlock = true;

                    // Grant coins reward
                    user.Coins += definition.RewardCoins;

                    // Push real-time SignalR toast
                    var notification = new AchievementNotificationDto
                    {
                        Id = definition.Id,
                        Name = definition.Name,
                        Description = definition.Description,
                        Rarity = definition.Rarity,
                        RewardCoins = definition.RewardCoins,
                        Icon = definition.Icon,
                        Region = definition.Region
                    };

                    // Fire-and-forget push
                    _ = _notificationService.NotifyAchievementUnlockedAsync(userId, notification);
                }
            }

            if (anyNewUnlock)
            {
                // Update User entity for coins
                await _userManager.UpdateAsync(user);
                // Save database records
                await _unitOfWork.SaveChangesAsync();
                // Invalidate Redis cache
                try
                {
                    await _cache.RemoveAsync($"achievements:{userId}");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to invalidate achievements cache for user {UserId} in Redis.", userId);
                }
            }
        }

        /// <inheritdoc/>
        public async Task<bool> UnlockAchievementManuallyAsync(string userId, string achievementId)
        {
            var definition = DefaultAchievements.FirstOrDefault(a => a.Id == achievementId);
            if (definition == null) return false;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var record = await _unitOfWork.UserAchievement
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AchievementId == achievementId);

            if (record != null && record.IsUnlocked)
            {
                return true; // Already unlocked
            }

            if (record == null)
            {
                record = new UserAchievement
                {
                    UserId = userId,
                    AchievementId = achievementId,
                    Progress = definition.TargetValue,
                    IsUnlocked = true,
                    UnlockedAt = DateTime.UtcNow
                };
                await _unitOfWork.UserAchievement.AddAsync(record);
            }
            else
            {
                record.Progress = definition.TargetValue;
                record.IsUnlocked = true;
                record.UnlockedAt = DateTime.UtcNow;
            }

            // Credit Coins
            user.Coins += definition.RewardCoins;

            await _userManager.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Clear cache
            try
            {
                await _cache.RemoveAsync($"achievements:{userId}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to invalidate achievements cache for user {UserId} in Redis.", userId);
            }

            // Notify SignalR
            var notification = new AchievementNotificationDto
            {
                Id = definition.Id,
                Name = definition.Name,
                Description = definition.Description,
                Rarity = definition.Rarity,
                RewardCoins = definition.RewardCoins,
                Icon = definition.Icon,
                Region = definition.Region
            };
            await _notificationService.NotifyAchievementUnlockedAsync(userId, notification);

            return true;
        }

        private static int CalculateStatProgress(ApplicationUser user, Achievement definition)
        {
            return definition.Id switch
            {
                // Progression levels
                var s when s.StartsWith("level_") => user.TrainerLevel,
                // Collection catch totals
                var s when s.StartsWith("catch_") => user.PokemonCaught,
                // Pokedex species diversity
                var s when s.StartsWith("unique_") => user.UniquePokemonCaught,
                // Shinies caught
                var s when s.StartsWith("shiny_") => user.ShinyPokemonCaught,
                // Legendaries caught
                var s when s.StartsWith("legendary_") => user.LegendaryPokemonCaught,
                // Friends
                var s when s.StartsWith("friends_") => user.FriendsCount,
                // Manual
                _ => 0
            };
        }
    }
}
