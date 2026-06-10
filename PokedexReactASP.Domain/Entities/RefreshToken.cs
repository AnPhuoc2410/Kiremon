using System;

namespace PokedexReactASP.Domain.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? DeviceInfo { get; set; }

        // Navigation property
        public ApplicationUser User { get; set; } = null!;
    }
}
