using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class CatchPokemonDto
    {
        [Required]
        public int PokemonId { get; set; }

        [StringLength(50)]
        public string? Nickname { get; set; }
    }
}
