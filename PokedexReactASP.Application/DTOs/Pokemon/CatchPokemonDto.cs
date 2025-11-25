using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    /// <summary>
    /// DTO for catching a new Pokemon from PokeAPI
    /// </summary>
    public class CatchPokemonDto
    {
        [Required]
        public int PokemonApiId { get; set; } // Changed from PokemonId to PokemonApiId

        [StringLength(50)]
        public string? Nickname { get; set; }
        
        [StringLength(100)]
        public string? CaughtLocation { get; set; }
        
        [Range(1, 100)]
        public int CaughtLevel { get; set; } = 5;
        
        public bool IsShiny { get; set; } = false;
        
        // Optional: Pre-generate IVs (if null, will be random)
        [Range(0, 31)]
        public int? IvHp { get; set; }
        
        [Range(0, 31)]
        public int? IvAttack { get; set; }
        
        [Range(0, 31)]
        public int? IvDefense { get; set; }
        
        [Range(0, 31)]
        public int? IvSpecialAttack { get; set; }
        
        [Range(0, 31)]
        public int? IvSpecialDefense { get; set; }
        
        [Range(0, 31)]
        public int? IvSpeed { get; set; }
    }
}
