using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.Interfaces;
using System.Security.Claims;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
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
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if user already exists
                if (await _authService.UserExistsAsync(registerDto.Username))
                {
                    return BadRequest(new { message = "Username already exists" });
                }

                if (await _authService.UserExistsAsync(registerDto.Email))
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                var response = await _authService.RegisterAsync(registerDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var response = await _authService.LoginAsync(loginDto);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("resend-confirmation")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ResendConfirmation([FromBody] ForgotPasswordDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _authService.ResendConfirmationEmailAsync(request.Email);
                return Ok(new { message = "If the account exists, a confirmation email has been sent." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("confirm-email")]
        public async Task<ActionResult> ConfirmEmail([FromBody] ConfirmEmailDto confirmEmailDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _authService.ConfirmEmailAsync(confirmEmailDto);
                return Ok(new { message = "Email confirmed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("external-login")]
        public async Task<ActionResult<AuthResponseDto>> ExternalLogin([FromBody] ExternalLoginDto externalLoginDto)
        {
            _logger.LogInformation("Provider: {Provider} \nToken: {token} ", externalLoginDto.Provider, externalLoginDto.Token);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var response = await _authService.ExternalLoginAsync(externalLoginDto);
                return Ok(response);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Social Login Error");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        [HttpPost("forgot-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _authService.ForgotPasswordAsync(forgotPasswordDto);
                return Ok(new { message = "If the account exists and email is confirmed, reset instructions have been sent." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _authService.ResetPasswordAsync(resetPasswordDto);
                return Ok(new { message = "Password reset successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);
                if (result)
                {
                    return Ok(new { message = "Password changed successfully" });
                }

                return BadRequest(new { message = "Failed to change password" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
            try
            {
                var response = await _authService.LoginTwoFactorAsync(dto);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("2fa/setup")]
        public async Task<ActionResult<TwoFactorDto>> SetupTwoFactor()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var result = await _authService.GetTwoFactorAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("2fa/enable")]
        public async Task<IActionResult> EnableTwoFactor([FromBody] Enable2FADto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var isSuccess = await _authService.EnableTwoFactorAsync(userId, dto);

                if (isSuccess)
                {
                    return Ok(new { message = "2FA enabled successfully" });
                }

                return BadRequest(new { message = "Invalid 2FA code." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("2fa/disable")]
        public async Task<IActionResult> DisableTwoFactor([FromBody] Disable2FADto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var isSuccess = await _authService.DisableTwoFactorAsync(userId, dto.Code);
                if (isSuccess)
                    return Ok(new { message = "2FA disabled successfully" });

                return BadRequest(new { message = "Failed to disable 2FA." });
            }
            catch (Exception ex)
            {

                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
