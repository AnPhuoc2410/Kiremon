using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class CreatePokemonDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Type1 { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Type2 { get; set; }

        [Range(1, 999)]
        public int Height { get; set; }

        [Range(1, 9999)]
        public int Weight { get; set; }

        [Required]
        [Url]
        public string ImageUrl { get; set; } = string.Empty;

        public string? Description { get; set; }
        public int BaseExperience { get; set; } = 100;
        public string? Category { get; set; }
        public string? Abilities { get; set; }
        
        [Range(1, 999)]
        public int Hp { get; set; }

        [Range(1, 999)]
        public int Attack { get; set; }

        [Range(1, 999)]
        public int Defense { get; set; }

        [Range(1, 999)]
        public int SpecialAttack { get; set; }

        [Range(1, 999)]
        public int SpecialDefense { get; set; }

        [Range(1, 999)]
        public int Speed { get; set; }
    }
}
