using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class BatchMovePokemonDto
    {
        [Required]
        public List<MovePokemonItemDto> Moves { get; set; } = new();
    }
}
