using PokedexReactASP.Application.DTOs.Auth;

namespace PokedexReactASP.Application.Interfaces
{
    public interface ISocialAuthService
    {
        Task<SocialUserDto> VerifyTokenAsync(string provider, string token);
    }
}
