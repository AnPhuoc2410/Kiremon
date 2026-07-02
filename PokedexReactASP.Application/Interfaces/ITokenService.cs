namespace PokedexReactASP.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateJwtToken(string userId, string username, string email, IList<string>? roles = null);
        string? ValidateToken(string token);
        string GenerateRefreshToken();
    }
}
