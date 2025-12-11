namespace PokedexReactASP.Application.DTOs.Auth
{
    public class ExternalLoginDto
    {
        public string Provider { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }
}
