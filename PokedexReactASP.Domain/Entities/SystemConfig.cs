using System;
using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Domain.Entities
{
    public class SystemConfig
    {
        [Key]
        [MaxLength(100)]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Value { get; set; } = string.Empty; // Configured as jsonb in PostgreSQL

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
