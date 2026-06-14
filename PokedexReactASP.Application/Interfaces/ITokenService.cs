using System.Collections.Generic;

namespace PokedexReactASP.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateJwtToken(string userId, string username, string email, IList<string> roles);
        string? ValidateToken(string token);
        string GenerateRefreshToken();
    }
}
