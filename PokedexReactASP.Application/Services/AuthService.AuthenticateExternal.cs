using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    public partial class AuthService
    {
        public async Task<AuthResultDto> ExternalLoginAsync(ExternalLoginDto loginDto, string? deviceInfo = null)
        {
            var socialUser = await _socialAuthService.VerifyTokenAsync(loginDto.Provider, loginDto.Token);

            if (socialUser == null)
            {
                throw new ApplicationException("External authenticaton failed.");
            }

            var user = await GetOrCreateUserFromSocialAuthAsync(socialUser, loginDto.Provider);

            return await GenerateExternalLoginResultAsync(user, deviceInfo);
        }

        /// <summary>
        /// Retrieves an existing user or provisions a new user based on social credentials.
        /// </summary>
        /// <param name="socialUser">The validated social user data.</param>
        /// <param name="provider">The authentication provider.</param>
        /// <returns>The application user.</returns>
        private async Task<ApplicationUser> GetOrCreateUserFromSocialAuthAsync(SocialUserDto socialUser, string provider)
        {
            var user = await _userManager.FindByLoginAsync(socialUser.Provider, socialUser.ProviderKey);

            if (user != null)
            {
                await UpdateUserLastActiveAsync(user);
                return user;
            }

            user = await _userManager.FindByEmailAsync(socialUser.Email);

            if (user == null)
            {
                user = await CreateSocialUserAsync(socialUser, provider);
            }
            else
            {
                await UpdateUserLastActiveAsync(user);
            }

            await LinkExternalLoginAsync(user, socialUser, provider);

            return user;
        }

        /// <summary>
        /// Updates the last active date of the user in the database.
        /// </summary>
        /// <param name="user">The user to update.</param>
        private async Task UpdateUserLastActiveAsync(ApplicationUser user)
        {
            user.LastActiveDate = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);
        }

        /// <summary>
        /// Creates and registers a new ApplicationUser based on verified social authentication.
        /// </summary>
        /// <param name="socialUser">The validated social user data.</param>
        /// <param name="provider">The authentication provider.</param>
        /// <returns>The newly created application user.</returns>
        /// <exception cref="InvalidOperationException">Thrown if user creation fails.</exception>
        private async Task<ApplicationUser> CreateSocialUserAsync(SocialUserDto socialUser, string provider)
        {
            var user = _mapper.Map<ApplicationUser>(socialUser);

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
                await SendWelcomeEmailForExternalUser(user, provider);
            }

            return user;
        }

        /// <summary>
        /// Links the social provider identity to the ApplicationUser.
        /// </summary>
        /// <param name="user">The application user.</param>
        /// <param name="socialUser">The validated social user data.</param>
        /// <param name="provider">The authentication provider.</param>
        private async Task LinkExternalLoginAsync(ApplicationUser user, SocialUserDto socialUser, string provider)
        {
            var addLoginResult = await _userManager.AddLoginAsync(
                user,
                new UserLoginInfo(
                    provider,
                    socialUser.ProviderKey,
                    $"{provider.ToLower()} account"
                )
            );

            if (!addLoginResult.Succeeded)
            {
                _logger.LogWarning("Failed to link {Provider} for user {Email}: {Errors}",
                    provider, user.Email,
                    string.Join(", ", addLoginResult.Errors.Select(e => e.Description)));
            }
        }

        /// <summary>
        /// Generates the appropriate authentication response based on security requirements (e.g. 2FA and email verification).
        /// </summary>
        /// <param name="user">The authenticated user.</param>
        /// <param name="deviceInfo">Optional client device information.</param>
        /// <returns>The authentication result.</returns>
        private async Task<AuthResultDto> GenerateExternalLoginResultAsync(ApplicationUser user, string? deviceInfo)
        {
            if (user.TwoFactorEnabled)
            {
                var isTrustedDevice = await _signInManager.IsTwoFactorClientRememberedAsync(user);

                if (isTrustedDevice)
                {
                    return await GenerateAuthResultAsync(user, deviceInfo);
                }

                return new AuthResultDto
                {
                    ResponseDto = await GenerateAuthResponseAsync(user, includeToken: false, requiresTwoFactor: true),
                    RefreshToken = null
                };
            }

            if (user.EmailConfirmed)
            {
                return await GenerateAuthResultAsync(user, deviceInfo);
            }

            return new AuthResultDto
            {
                ResponseDto = await GenerateAuthResponseAsync(user, includeToken: false, requiresTwoFactor: false),
                RefreshToken = null
            };
        }

        /// <summary>
        /// Sends a welcome email containing a confirmation link for an external user registration.
        /// </summary>
        /// <param name="user">The newly created user.</param>
        /// <param name="provider">The external provider used for registration.</param>
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
