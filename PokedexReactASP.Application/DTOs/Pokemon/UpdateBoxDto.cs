using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class UpdateBoxDto
    {
        [Required]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Box name must be between 1 and 50 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string BackgroundImage { get; set; } = string.Empty;
    }
}
