using PokedexReactASP.Application.DTOs.Auth;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> ExternalLoginAsync(ExternalLoginDto loginDto);
        Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto);
        Task<bool> UserExistsAsync(string usernameOrEmail);
        Task ResendConfirmationEmailAsync(string email);
        Task ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto);
        Task ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto);

        // Two-Factor Authentication

        Task<TwoFactorDto> GetTwoFactorAsync(string userId);
        Task<bool> EnableTwoFactorAsync(string userId, Enable2FADto dto);
        Task<AuthResponseDto> LoginTwoFactorAsync(TwoFactorLoginDto dto);

    }
}
