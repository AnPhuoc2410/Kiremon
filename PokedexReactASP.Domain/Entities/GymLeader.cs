using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Domain.Entities
{
    public class GymLeader
    {
        [Key]
        [MaxLength(100)]
        public string Id { get; set; } = string.Empty; // matches achievementId, e.g., 'kanto_badge_brock'

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string BadgeName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Region { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Avatar { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Sprite { get; set; } = string.Empty;

        [Required]
        public string RosterJson { get; set; } = string.Empty; // JSON spec of Pokemon moves & stats, mapped to jsonb column
    }
}
