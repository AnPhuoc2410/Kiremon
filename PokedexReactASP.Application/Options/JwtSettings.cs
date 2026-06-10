using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.Options
{
    public class JwtSettings
    {
        public const string SectionName = "JwtSettings";

        [Required]
        public string SecretKey { get; set; } = string.Empty;

        [Required]
        public string Issuer { get; set; } = string.Empty;

        [Required]
        public string Audience { get; set; } = string.Empty;

        /// <summary>Token lifetime in minutes</summary>
        [Range(1, 365 * 24 * 60)]
        public int ExpirationMinutes { get; set; }

        /// <summary>Refresh token lifetime in days</summary>
        [Range(1, 365)]
        public int RefreshTokenExpirationDays { get; set; }
    }
}
