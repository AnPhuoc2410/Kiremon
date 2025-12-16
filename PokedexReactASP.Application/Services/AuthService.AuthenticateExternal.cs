using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    public partial class AuthService
    {
        public async Task<AuthResponseDto> ExternalLoginAsync(ExternalLoginDto loginDto)
        {
            var socialUser = await _socialAuthService.VerifyTokenAsync(loginDto.Provider, loginDto.Token);

            if (socialUser == null)
                throw new ApplicationException("External authenticaton failed.");

            var user = await _userManager.FindByLoginAsync(socialUser.Provider, socialUser.ProviderKey);
            bool isNewUser = false;

            if (user != null)
            {
                user.LastActiveDate = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);
            }
            else
            {
                user = await _userManager.FindByEmailAsync(socialUser.Email);

                if (user == null)
                {
                    isNewUser = true;
                    user = _mapper.Map<ApplicationUser>(socialUser);

                    if (socialUser.IsEmailVerified)
                    {
                        user.EmailConfirmed = true;
                    }

                    var result = await _userManager.CreateAsync(user);

                    if (!result.Succeeded)
                    {
                        throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
                    }

                    await _userManager.AddToRoleAsync(user, "User");

                    if (!socialUser.IsEmailVerified)
                    {
                        await SendWelcomeEmailForExternalUser(user, loginDto.Provider);
                    }
                }
                else
                {
                    user.LastActiveDate = DateTime.UtcNow;
                    await _userManager.UpdateAsync(user);
                }

                var addLoginResult = await _userManager.AddLoginAsync(
                    user,
                    new UserLoginInfo(
                        loginDto.Provider,
                        socialUser.ProviderKey,
                        $"{loginDto.Provider.ToLower()} account"
                    )
                );

                if (!addLoginResult.Succeeded)
                {
                    _logger.LogWarning("Failed to link {Provider} for user {Email}: {Errors}",
                        loginDto.Provider, user.Email,
                        string.Join(", ", addLoginResult.Errors.Select(e => e.Description)));
                }
            }

            if (user.TwoFactorEnabled)
            {
                var isTrustedDevice = await _signInManager.IsTwoFactorClientRememberedAsync(user);

                if (isTrustedDevice)
                {
                    return GenerateAuthResponse(user, includeToken: true, requiresTwoFactor: false);
                }

                return GenerateAuthResponse(user, includeToken: false, requiresTwoFactor: true);
            }

            return GenerateAuthResponse(user, includeToken: user.EmailConfirmed, requiresTwoFactor: false);
        }

        private async Task SendWelcomeEmailForExternalUser(ApplicationUser user, string provider)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = BuildEmailConfirmationLink(token, user.Id);
            try
            {
                await _emailService.SendExternalWelcomeConfirmationAsync(user, confirmationLink, provider);
                _logger.LogInformation("Welcome email sent to {Email} via {Provider} registration", user.Email, provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send welcome email to {Email} for {Provider} registration", user.Email, provider);
                throw new InvalidOperationException("Failed to send welcome email. Please try again later.");
            }
        }
    }
}
