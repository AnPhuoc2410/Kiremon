using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.DTOs.Auth;

namespace PokedexReactASP.Application.Services
{
    public partial class AuthService
    {
        // 1. Lấy thông tin Setup (QR Code)
        public async Task<TwoFactorDto> GetTwoFactorAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            // Lấy key 2FA trong DB (Bảng AspNetUserTokens)
            var key = await _userManager.GetAuthenticatorKeyAsync(user);

            // Nếu chưa có thì reset để tạo mới
            if (string.IsNullOrEmpty(key))
            {
                await _userManager.ResetAuthenticatorKeyAsync(user);
                key = await _userManager.GetAuthenticatorKeyAsync(user);
            }

            // Tạo format URI cho Google Authenticator
            var email = user.Email;
            var appName = "PokedexApp";
            var qrUri = string.Format(
                "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6",
                _urlEncoder.Encode(appName),
                _urlEncoder.Encode(email),
                key);


            return new TwoFactorDto
            {
                SharedKey = key,
                QrCodeUri = qrUri
            };
        }

        public async Task<bool> EnableTwoFactorAsync(string userId, Enable2FADto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("EnableTwoFactorAsync: User not found with ID {UserId}", userId);
                return false;
            }

            var isTokenValid = await _userManager.VerifyTwoFactorTokenAsync(
                user,
                _userManager.Options.Tokens.AuthenticatorTokenProvider,
                dto.Code);

            if (!isTokenValid)
            {
                 _logger.LogWarning("EnableTwoFactorAsync: Invalid 2FA code for user ID {UserId}", userId);
                return false;
            }    

            await _userManager.SetTwoFactorEnabledAsync(user, true);

            return true;
        }


        public async Task<AuthResponseDto> LoginTwoFactorAsync(TwoFactorLoginDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            var isTokenValid = await _userManager.VerifyTwoFactorTokenAsync(
                user,
                _userManager.Options.Tokens.AuthenticatorTokenProvider,
                dto.Code);

            if (!isTokenValid)
            {
                throw new UnauthorizedAccessException("Invalid 2FA Code");
            }

            return GenerateAuthResponse(user, includeToken: user.EmailConfirmed, requiresTwoFactor: false);

        }
    }
}
