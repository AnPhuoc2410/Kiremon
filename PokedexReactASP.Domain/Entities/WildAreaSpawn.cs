using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Domain.Entities
{
    public class WildAreaSpawn
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public int PokemonApiId { get; set; }

        public string AreaCode { get; set; } = "viridian_field";
        public int SlotIndex { get; set; }

        public WildSpawnRarity SpawnRarity { get; set; } = WildSpawnRarity.Common;

        public DateTime SpawnedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }

        public int MaxAttempts { get; set; } = 3;
        public int AttemptsUsed { get; set; } = 0;

        public bool IsCaught { get; set; } = false;
        public bool IsConsumed { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }
}
