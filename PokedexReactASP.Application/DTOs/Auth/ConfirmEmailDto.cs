using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Auth
{
    public class ConfirmEmailDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;
    }
}

