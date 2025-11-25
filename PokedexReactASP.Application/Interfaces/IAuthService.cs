using PokedexReactASP.Application.DTOs.Auth;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto);
        Task<bool> UserExistsAsync(string usernameOrEmail);
    }
}
