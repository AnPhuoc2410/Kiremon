using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IMapper mapper,
            IEmailService emailService,
            IOptions<EmailSettings> emailOptions,
            ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
            _emailService = emailService;
            _emailSettings = emailOptions.Value;
            _logger = logger;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
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

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = loginDto.UsernameOrEmail.Contains("@")
                ? await _userManager.FindByEmailAsync(loginDto.UsernameOrEmail)
                : await _userManager.FindByNameAsync(loginDto.UsernameOrEmail);

            if (user == null) throw new UnauthorizedAccessException("Invalid credentials");

            if (!user.EmailConfirmed)
            {
                throw new UnauthorizedAccessException("Email is not verified. Please confirm your email before logging in.");
            }

            //Kiểm tra mật khẩu có kích hoạt tính năng KHÓA TÀI KHOẢN (Lockout)
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                // Reset bộ đếm số lần sai về 0 nếu login thành công
                await _userManager.ResetAccessFailedCountAsync(user);
                return GenerateAuthResponse(user);
            }

            if (result.IsLockedOut)
            {
                throw new UnauthorizedAccessException("Account is locked due to multiple failed attempts. Please try again later.");
            }

            throw new UnauthorizedAccessException("Invalid credentials");
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

            var decodedToken = WebUtility.UrlDecode(confirmEmailDto.Token);
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

            var decodedToken = WebUtility.UrlDecode(resetPasswordDto.Token);
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

        private AuthResponseDto GenerateAuthResponse(ApplicationUser user, bool includeToken = true)
        {
            var response = _mapper.Map<AuthResponseDto>(user);
            response.EmailConfirmed = user.EmailConfirmed;

            if (includeToken && user.EmailConfirmed)
            {
                response.Token = _tokenService.GenerateJwtToken(user.Id, user.UserName!, user.Email!);
                response.ExpiresAt = DateTime.UtcNow.AddDays(7); // Production nên cân nhắc Refresh Token
            }
            return response;
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
            var encodedToken = WebUtility.UrlEncode(token);
            var path = string.IsNullOrWhiteSpace(_emailSettings.EmailConfirmationPath)
                ? "/Auth/confirm-email"
                : _emailSettings.EmailConfirmationPath;

            return $"https://localhost:7051/api{path}?userId={userId}&token={encodedToken}";
        }

        private string BuildResetPasswordLink(string token, string email)
        {
            var encodedToken = WebUtility.UrlEncode(token);
            var baseUrl = _emailSettings.FrontendBaseUrl?.TrimEnd('/');
            var path = string.IsNullOrWhiteSpace(_emailSettings.ResetPasswordPath)
                ? "/Auth/reset-password"
                : _emailSettings.ResetPasswordPath;

            return $"{baseUrl}{path}?email={WebUtility.UrlEncode(email)}&token={encodedToken}";
        }
    }
}
