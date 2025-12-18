using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class CatchPokemonDto
    {
        [Required]
        public int PokemonApiId { get; set; }

        [StringLength(50)]
        public string? Nickname { get; set; }

        [StringLength(100)]
        public string? CaughtLocation { get; set; }

    }
}
