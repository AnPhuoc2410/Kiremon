namespace PokedexReactASP.Application.DTOs.Auth
{
    public class AuthResultDto
    {
        public AuthResponseDto ResponseDto { get; set; } = null!;
        public string? RefreshToken { get; set; }
    }
}
