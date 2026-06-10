using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using System.Security.Claims;

namespace PokedexReactASP.Server.Controllers
{
    [Route("api/auth")]
    public class AuthController : ApiControllerBase
    {
        private const string RefreshTokenCookieName = "refreshToken";
        private const string AuthCookiePath = "/api/auth";
        private const string DevEnvName = "Development";
        private const string EnvVarName = "ASPNETCORE_ENVIRONMENT";

        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly JwtSettings _jwtSettings;

        private bool IsDevelopment => Environment.GetEnvironmentVariable(EnvVarName) == DevEnvName;

        public AuthController(IAuthService authService, ILogger<AuthController> logger, IOptions<JwtSettings> jwtOptions)
        {
            _authService = authService;
            _logger = logger;
            _jwtSettings = jwtOptions.Value;
        }

        [HttpPost("register")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (await _authService.UserExistsAsync(registerDto.Username))
                return BadRequest(new { message = "Username already exists" });

            if (await _authService.UserExistsAsync(registerDto.Email))
                return BadRequest(new { message = "Email already exists" });

            var response = await _authService.RegisterAsync(registerDto);
            return Ok(response);
        }

        [HttpPost("login")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var userAgent = Request.Headers["User-Agent"].ToString();
            var result = await _authService.LoginAsync(loginDto, userAgent);

            return HandleAuthResult(result);
        }

        [HttpPost("resend-confirmation")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ResendConfirmation([FromBody] ForgotPasswordDto request)
        {
            await _authService.ResendConfirmationEmailAsync(request.Email);
            return Ok(new { message = "If the account exists, a confirmation email has been sent." });
        }

        [HttpPost("confirm-email")]
        public async Task<ActionResult> ConfirmEmail([FromBody] ConfirmEmailDto confirmEmailDto)
        {
            await _authService.ConfirmEmailAsync(confirmEmailDto);
            return Ok(new { message = "Email confirmed successfully" });
        }

        [HttpPost("external-login")]
        public async Task<ActionResult<AuthResponseDto>> ExternalLogin([FromBody] ExternalLoginDto externalLoginDto)
        {
            var userAgent = Request.Headers["User-Agent"].ToString();
            var result = await _authService.ExternalLoginAsync(externalLoginDto, userAgent);

            return HandleAuthResult(result);
        }

        [HttpPost("forgot-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            await _authService.ForgotPasswordAsync(forgotPasswordDto);
            return Ok(new { message = "If the account exists and email is confirmed, reset instructions have been sent." });
        }

        [HttpPost("reset-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            await _authService.ResetPasswordAsync(resetPasswordDto);
            return Ok(new { message = "Password reset successfully" });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            if (string.IsNullOrEmpty(CurrentUserId))
                return Unauthorized();

            var result = await _authService.ChangePasswordAsync(CurrentUserId, changePasswordDto);
            if (result)
                return Ok(new { message = "Password changed successfully" });

            return BadRequest(new { message = "Failed to change password" });
        }

        [HttpGet("check-username/{username}")]
        public async Task<ActionResult<bool>> CheckUsername(string username)
        {
            var exists = await _authService.UserExistsAsync(username);
            return Ok(new { exists });
        }

        [HttpPost("login-2fa")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> LoginTwoFactor([FromBody] TwoFactorLoginDto dto)
        {
            var userAgent = Request.Headers["User-Agent"].ToString();
            var result = await _authService.LoginTwoFactorAsync(dto, userAgent);

            return HandleAuthResult(result);
        }

        [Authorize]
        [HttpGet("2fa/setup")]
        public async Task<ActionResult<TwoFactorDto>> SetupTwoFactor()
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var result = await _authService.GetTwoFactorAsync(CurrentUserId);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("2fa/enable")]
        public async Task<IActionResult> EnableTwoFactor([FromBody] Enable2FADto dto)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var isSuccess = await _authService.EnableTwoFactorAsync(CurrentUserId, dto);

            if (isSuccess)
                return Ok(new { message = "2FA enabled successfully" });

            return BadRequest(new { message = "Invalid 2FA code." });
        }

        [Authorize]
        [HttpPost("2fa/disable")]
        public async Task<IActionResult> DisableTwoFactor([FromBody] Disable2FADto dto)
        {
            if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized();
            var isSuccess = await _authService.DisableTwoFactorAsync(CurrentUserId, dto.Code);

            if (isSuccess)
                return Ok(new { message = "2FA disabled successfully" });

            return BadRequest(new { message = "Failed to disable 2FA." });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponseDto>> Refresh()
        {
            var refreshToken = Request.Cookies[RefreshTokenCookieName];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "Refresh token is missing." });
            }

            var deviceInfo = Request.Headers["User-Agent"].ToString();

            try
            {
                var result = await _authService.RefreshAsync(refreshToken, deviceInfo);
                return HandleAuthResult(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("revoke")]
        public async Task<IActionResult> Revoke()
        {
            var refreshToken = Request.Cookies[RefreshTokenCookieName];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _authService.RevokeAsync(refreshToken);
            }

            // Clear the cookie
            Response.Cookies.Delete(RefreshTokenCookieName, GetCookieOptions(isExpired: true));

            return Ok(new { message = "Token revoked successfully" });
        }

        private CookieOptions GetCookieOptions(bool isExpired = false)
        {
            var isDev = IsDevelopment;
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDev && Request.IsHttps,
                SameSite = isDev ? SameSiteMode.Lax : SameSiteMode.None,
                Path = AuthCookiePath
            };

            if (!isExpired)
            {
                options.Expires = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
            }

            return options;
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            Response.Cookies.Append(RefreshTokenCookieName, refreshToken, GetCookieOptions());
        }

        private ActionResult<AuthResponseDto> HandleAuthResult(AuthResultDto result)
        {
            if (!string.IsNullOrEmpty(result.RefreshToken))
            {
                SetRefreshTokenCookie(result.RefreshToken);
            }

            return Ok(result.ResponseDto);
        }
    }
}
