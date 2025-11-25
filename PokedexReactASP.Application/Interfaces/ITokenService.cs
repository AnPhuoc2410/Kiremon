namespace PokedexReactASP.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateJwtToken(string userId, string username, string email);
        string? ValidateToken(string token);
    }
}
