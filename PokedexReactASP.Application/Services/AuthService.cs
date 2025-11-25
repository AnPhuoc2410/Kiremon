using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            ITokenService tokenService,
            IMapper mapper)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var user = _mapper.Map<ApplicationUser>(registerDto);
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            var authResponse = _mapper.Map<AuthResponseDto>(user);
            authResponse.Token = _tokenService.GenerateJwtToken(user.Id, user.UserName!, user.Email!);
            authResponse.ExpiresAt = DateTime.UtcNow.AddDays(7);

            return authResponse;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            ApplicationUser? user;

            // Check if it's an email or username
            if (loginDto.UsernameOrEmail.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(loginDto.UsernameOrEmail);
            }
            else
            {
                user = await _userManager.FindByNameAsync(loginDto.UsernameOrEmail);
            }

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid username/email or password");
            }

            // Verify password using UserManager instead of SignInManager
            var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!passwordValid)
            {
                throw new UnauthorizedAccessException("Invalid username/email or password");
            }

            var authResponse = _mapper.Map<AuthResponseDto>(user);
            authResponse.Token = _tokenService.GenerateJwtToken(user.Id, user.UserName!, user.Email!);
            authResponse.ExpiresAt = DateTime.UtcNow.AddDays(7);

            return authResponse;
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
    }
}
