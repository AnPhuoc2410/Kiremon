using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.Interfaces;
using System.Security.Claims;

namespace PokedexReactASP.Server.Controllers
{
    [Route("api/auth")]
    public class AuthController : ApiControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _authService.LoginAsync(loginDto);
            return Ok(response);
        }

        [HttpPost("resend-confirmation")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ResendConfirmation([FromBody] ForgotPasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _authService.ResendConfirmationEmailAsync(request.Email);
            return Ok(new { message = "If the account exists, a confirmation email has been sent." });
        }

        [HttpPost("confirm-email")]
        public async Task<ActionResult> ConfirmEmail([FromBody] ConfirmEmailDto confirmEmailDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _authService.ConfirmEmailAsync(confirmEmailDto);
            return Ok(new { message = "Email confirmed successfully" });
        }

        [HttpPost("external-login")]
        public async Task<ActionResult<AuthResponseDto>> ExternalLogin([FromBody] ExternalLoginDto externalLoginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _authService.ExternalLoginAsync(externalLoginDto);
            return Ok(response);
        }

        [HttpPost("forgot-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _authService.ForgotPasswordAsync(forgotPasswordDto);
            return Ok(new { message = "If the account exists and email is confirmed, reset instructions have been sent." });
        }

        [HttpPost("reset-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _authService.ResetPasswordAsync(resetPasswordDto);
            return Ok(new { message = "Password reset successfully" });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);
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
            var response = await _authService.LoginTwoFactorAsync(dto);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("2fa/setup")]
        public async Task<ActionResult<TwoFactorDto>> SetupTwoFactor()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _authService.GetTwoFactorAsync(userId);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("2fa/enable")]
        public async Task<IActionResult> EnableTwoFactor([FromBody] Enable2FADto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isSuccess = await _authService.EnableTwoFactorAsync(userId, dto);

            if (isSuccess)
                return Ok(new { message = "2FA enabled successfully" });

            return BadRequest(new { message = "Invalid 2FA code." });
        }

        [Authorize]
        [HttpPost("2fa/disable")]
        public async Task<IActionResult> DisableTwoFactor([FromBody] Disable2FADto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isSuccess = await _authService.DisableTwoFactorAsync(userId, dto.Code);

            if (isSuccess)
                return Ok(new { message = "2FA disabled successfully" });

            return BadRequest(new { message = "Failed to disable 2FA." });
        }
    }
}
