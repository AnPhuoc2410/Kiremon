using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Auth
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Username or Email is required")]
        public string UsernameOrEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "reCAPTCHA token is required")]
        public string ReCaptchaToken { get; set; } = string.Empty;
    }
}
