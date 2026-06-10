using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using System.Text.Encodings.Web;

namespace PokedexReactASP.Application.Services
{
    public partial class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IRecaptchaService _recaptchaService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly EmailSettings _emailSettings;
        private readonly ISocialAuthService _socialAuthService;
        private readonly UrlEncoder _urlEncoder;
        private readonly ILogger<AuthService> _logger;
        private readonly JwtSettings _jwtSettings;
        private readonly IUnitOfWork _unitOfWork;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IRecaptchaService recaptchaService,
            IMapper mapper,
            IEmailService emailService,
            IOptions<EmailSettings> emailOptions,
            ISocialAuthService socialAuthService,
            UrlEncoder urlEncoder,
            ILogger<AuthService> logger,
            IOptions<JwtSettings> jwtOptions,
            IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _recaptchaService = recaptchaService;
            _mapper = mapper;
            _emailService = emailService;
            _emailSettings = emailOptions.Value;
            _socialAuthService = socialAuthService;
            _urlEncoder = urlEncoder;
            _logger = logger;
            _jwtSettings = jwtOptions.Value;
            _unitOfWork = unitOfWork;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var existingUserByEmail = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUserByEmail != null && !existingUserByEmail.EmailConfirmed)
            {
                await _userManager.DeleteAsync(existingUserByEmail);
            }

            var existingUserByName = await _userManager.FindByNameAsync(registerDto.Username);
            if (existingUserByName != null && !existingUserByName.EmailConfirmed)
            {
                if (existingUserByEmail == null || existingUserByEmail.Id != existingUserByName.Id)
                {
                    await _userManager.DeleteAsync(existingUserByName);
                }
            }

            var user = _mapper.Map<ApplicationUser>(registerDto);
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            await _userManager.AddToRoleAsync(user, "User");

            await _userManager.AddLoginAsync(user, new UserLoginInfo("Local", user.Id, "Local Account"));

            await SendConfirmationEmail(user);

            return GenerateAuthResponse(user, includeToken: false);
        }

        public async Task<AuthResultDto> LoginAsync(LoginDto loginDto, string? deviceInfo = null)
        {
            var captchaPassed = await _recaptchaService.ValidateAsync(loginDto.ReCaptchaToken);
            if (!captchaPassed)
            {
                throw new UnauthorizedAccessException("reCAPTCHA validation failed.");
            }

            var user = loginDto.UsernameOrEmail.Contains("@")
                ? await _userManager.FindByEmailAsync(loginDto.UsernameOrEmail)
                : await _userManager.FindByNameAsync(loginDto.UsernameOrEmail);

            if (user == null) throw new UnauthorizedAccessException("Invalid credentials");

            if (!user.EmailConfirmed)
            {
                throw new UnauthorizedAccessException("Email is not verified. Please check your inbox or request a new confirmation link.");
            }

            var result = await _signInManager.PasswordSignInAsync(
                user,
                loginDto.Password,
                isPersistent: false,
                lockoutOnFailure: true
            );

            if (result.IsLockedOut)
            {
                throw new UnauthorizedAccessException("Account is locked due to multiple failed attempts. Please try again later.");
            }

            if (!result.Succeeded && !result.RequiresTwoFactor)
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            await _userManager.ResetAccessFailedCountAsync(user);

            if (result.RequiresTwoFactor)
            {
                await _signInManager.SignOutAsync();

                var isTrustedDevice = await _signInManager.IsTwoFactorClientRememberedAsync(user);

                if (isTrustedDevice)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return await GenerateAuthResultAsync(user, deviceInfo);
                }

                return new AuthResultDto
                {
                    ResponseDto = GenerateAuthResponse(user, includeToken: false, requiresTwoFactor: true),
                    RefreshToken = null
                };
            }

            return await GenerateAuthResultAsync(user, deviceInfo);
        }

        public async Task ResendConfirmationEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            if (user.EmailConfirmed)
            {
                return;
            }

            await SendConfirmationEmail(user);
        }

        public async Task ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto)
        {
            var user = await _userManager.FindByIdAsync(confirmEmailDto.UserId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            if (user.EmailConfirmed)
            {
                return;
            }

            var decodedToken = Uri.UnescapeDataString(confirmEmailDto.Token);
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        public async Task ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
            {
                return;
            }

            if (!user.EmailConfirmed)
            {
                throw new InvalidOperationException("Email is not verified. Please confirm your email first.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = BuildResetPasswordLink(token, user.Email!);
            await _emailService.SendPasswordResetAsync(user, resetLink, token);
        }

        public async Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var decodedToken = Uri.UnescapeDataString(resetPasswordDto.Token);
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, resetPasswordDto.NewPassword);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var result = await _userManager.ChangePasswordAsync(
                user,
                changePasswordDto.CurrentPassword,
                changePasswordDto.NewPassword);

            return result.Succeeded;
        }

        public async Task<bool> UserExistsAsync(string usernameOrEmail)
        {
            if (usernameOrEmail.Contains("@"))
            {
                return await _userManager.FindByEmailAsync(usernameOrEmail) != null;
            }
            return await _userManager.FindByNameAsync(usernameOrEmail) != null;
        }

        private AuthResponseDto GenerateAuthResponse(ApplicationUser user, bool includeToken = true, bool requiresTwoFactor = false)
        {
            var response = _mapper.Map<AuthResponseDto>(user);
            response.EmailConfirmed = user.EmailConfirmed;
            response.RequiresTwoFactor = requiresTwoFactor;

            if (includeToken && user.EmailConfirmed)
            {
                response.Token = _tokenService.GenerateJwtToken(user.Id, user.UserName!, user.Email!);
                response.ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);
            }

            return response;
        }

        private async Task<AuthResultDto> GenerateAuthResultAsync(ApplicationUser user, string? deviceInfo)
        {
            var responseDto = _mapper.Map<AuthResponseDto>(user);
            responseDto.EmailConfirmed = user.EmailConfirmed;
            responseDto.RequiresTwoFactor = false;
            responseDto.TwoFactorEnabled = await _userManager.GetTwoFactorEnabledAsync(user);

            var accessToken = _tokenService.GenerateJwtToken(user.Id, user.UserName!, user.Email!);
            responseDto.Token = accessToken;
            responseDto.ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);

            // Generate refresh token
            var refreshTokenString = _tokenService.GenerateRefreshToken();
            var expiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);

            var refreshTokenEntity = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenString,
                ExpiresAt = expiryTime,
                DeviceInfo = deviceInfo,
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            await _unitOfWork.RefreshToken.AddAsync(refreshTokenEntity);
            await _unitOfWork.SaveChangesAsync();

            return new AuthResultDto
            {
                ResponseDto = responseDto,
                RefreshToken = refreshTokenString
            };
        }

        public async Task<AuthResultDto> RefreshAsync(string refreshToken, string deviceInfo)
        {
            var dbToken = await _unitOfWork.RefreshToken.FirstOrDefaultAsync(
                t => t.Token == refreshToken && !t.IsRevoked && t.ExpiresAt > DateTime.UtcNow
            );

            if (dbToken == null)
            {
                throw new UnauthorizedAccessException("Session expired or invalid refresh token.");
            }

            var user = await _userManager.FindByIdAsync(dbToken.UserId);
            if (user == null || !user.EmailConfirmed)
            {
                throw new UnauthorizedAccessException("User invalid or email not confirmed.");
            }

            // Revoke old token
            dbToken.IsRevoked = true;
            _unitOfWork.RefreshToken.Update(dbToken);

            // Generate new token pair
            var newAccessToken = _tokenService.GenerateJwtToken(user.Id, user.UserName!, user.Email!);
            var newRefreshTokenString = _tokenService.GenerateRefreshToken();
            var expiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);

            var newDbToken = new RefreshToken
            {
                UserId = user.Id,
                Token = newRefreshTokenString,
                ExpiresAt = expiryTime,
                DeviceInfo = deviceInfo,
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            await _unitOfWork.RefreshToken.AddAsync(newDbToken);
            await _unitOfWork.SaveChangesAsync();

            var responseDto = _mapper.Map<AuthResponseDto>(user);
            responseDto.Token = newAccessToken;
            responseDto.ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);
            responseDto.EmailConfirmed = user.EmailConfirmed;

            return new AuthResultDto
            {
                ResponseDto = responseDto,
                RefreshToken = newRefreshTokenString
            };
        }

        public async Task RevokeAsync(string refreshToken)
        {
            var dbToken = await _unitOfWork.RefreshToken.FirstOrDefaultAsync(t => t.Token == refreshToken);
            if (dbToken != null)
            {
                dbToken.IsRevoked = true;
                _unitOfWork.RefreshToken.Update(dbToken);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        private async Task SendConfirmationEmail(ApplicationUser user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = BuildEmailConfirmationLink(token, user.Id);
            try
            {
                await _emailService.SendWelcomeConfirmationAsync(user, confirmationLink);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send confirmation email to {Email}", user.Email);
                throw new InvalidOperationException("Failed to send confirmation email. Please try again later.");
            }
        }

        private string BuildEmailConfirmationLink(string token, string userId)
        {
            var encodedToken = Uri.EscapeDataString(token);
            var baseUrl = _emailSettings.FrontendBaseUrl?.TrimEnd('/');
            var path = "/auth/confirm-email";

            return $"{baseUrl}{path}?userId={userId}&token={encodedToken}";
        }

        private string BuildResetPasswordLink(string token, string email)
        {
            var encodedToken = Uri.EscapeDataString(token);
            var baseUrl = _emailSettings.FrontendBaseUrl?.TrimEnd('/');
            var path = "/auth/reset-password";

            return $"{baseUrl}{path}?email={Uri.EscapeDataString(email)}&token={encodedToken}";
        }
    }
}
