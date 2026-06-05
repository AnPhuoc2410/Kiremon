using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.Options
{
    public class JwtSettings
    {
        public const string SectionName = "JwtSettings";

        [Required]
        public string SecretKey { get; set; } = string.Empty;

        [Required]
        public string Issuer { get; set; } = "PokedexAPI";

        [Required]
        public string Audience { get; set; } = "PokedexClient";

        /// <summary>Token lifetime in days. Defaults to 7.</summary>
        [Range(1, 365)]
        public int ExpirationDays { get; set; } = 7;
    }
}
