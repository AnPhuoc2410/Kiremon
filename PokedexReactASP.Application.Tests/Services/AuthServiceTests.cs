using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<SignInManager<ApplicationUser>> _mockSignInManager;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly Mock<IRecaptchaService> _mockRecaptchaService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly Mock<ISocialAuthService> _mockSocialAuthService;
        private readonly Mock<ILogger<AuthService>> _mockLogger;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;

        private readonly IOptions<EmailSettings> _emailOptions;
        private readonly IOptions<JwtSettings> _jwtOptions;
        private readonly AuthService _service;

        public AuthServiceTests()
        {
            _mockUserManager = MockIdentityHelpers.MockUserManager<ApplicationUser>();
            _mockSignInManager = MockIdentityHelpers.MockSignInManager<ApplicationUser>(_mockUserManager.Object);
            
            _mockTokenService = new Mock<ITokenService>();
            _mockRecaptchaService = new Mock<IRecaptchaService>();
            _mockMapper = new Mock<IMapper>();
            _mockEmailService = new Mock<IEmailService>();
            _mockSocialAuthService = new Mock<ISocialAuthService>();
            _mockLogger = new Mock<ILogger<AuthService>>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();

            _emailOptions = Microsoft.Extensions.Options.Options.Create(new EmailSettings { FrontendBaseUrl = "http://localhost:3000" });
            _jwtOptions = Microsoft.Extensions.Options.Options.Create(new JwtSettings { ExpirationMinutes = 60, RefreshTokenExpirationDays = 7 });

            _service = new AuthService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockTokenService.Object,
                _mockRecaptchaService.Object,
                _mockMapper.Object,
                _mockEmailService.Object,
                _emailOptions,
                _mockSocialAuthService.Object,
                UrlEncoder.Default,
                _mockLogger.Object,
                _jwtOptions,
                _mockUnitOfWork.Object
            );
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnAuthResponse_WhenValid()
        {
            // Arrange
            var registerDto = new RegisterDto { Username = "testuser", Email = "test@example.com", Password = "Password123!" };
            var user = new ApplicationUser { Id = "1", UserName = "testuser", Email = "test@example.com" };

            _mockUserManager.Setup(u => u.FindByEmailAsync(registerDto.Email)).ReturnsAsync((ApplicationUser)null);
            _mockUserManager.Setup(u => u.FindByNameAsync(registerDto.Username)).ReturnsAsync((ApplicationUser)null);
            _mockMapper.Setup(m => m.Map<ApplicationUser>(registerDto)).Returns(user);
            _mockUserManager.Setup(u => u.CreateAsync(user, registerDto.Password)).ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(u => u.GenerateEmailConfirmationTokenAsync(user)).ReturnsAsync("token");
            _mockUserManager.Setup(u => u.GetRolesAsync(user)).ReturnsAsync(new List<string>());

            _mockMapper.Setup(m => m.Map<AuthResponseDto>(user)).Returns(new AuthResponseDto { Username = "testuser" });

            // Act
            var result = await _service.RegisterAsync(registerDto);

            // Assert
            result.Should().NotBeNull();
            result.Username.Should().Be("testuser");
            _mockUserManager.Verify(u => u.AddToRoleAsync(user, "User"), Times.Once);
            _mockEmailService.Verify(e => e.SendWelcomeConfirmationAsync(user, It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_ShouldThrowUnauthorized_WhenCaptchaFails()
        {
            // Arrange
            var loginDto = new LoginDto { UsernameOrEmail = "user", Password = "pw", ReCaptchaToken = "invalid" };
            _mockRecaptchaService.Setup(r => r.ValidateAsync(loginDto.ReCaptchaToken, default)).ReturnsAsync(false);
            
            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.LoginAsync(loginDto));
        }

        [Fact]
        public async Task LoginAsync_ShouldThrowUnauthorized_WhenUserNotFound()
        {
            // Arrange
            var loginDto = new LoginDto { UsernameOrEmail = "notfound@example.com", Password = "pw", ReCaptchaToken = "valid" };
            _mockRecaptchaService.Setup(r => r.ValidateAsync(loginDto.ReCaptchaToken, default)).ReturnsAsync(true);
            _mockUserManager.Setup(u => u.FindByEmailAsync(loginDto.UsernameOrEmail)).ReturnsAsync((ApplicationUser)null);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.LoginAsync(loginDto, "TestDevice"));
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnAuthResult_WhenCredentialsValid()
        {
            // Arrange
            var loginDto = new LoginDto { UsernameOrEmail = "test@example.com", Password = "Password123!", ReCaptchaToken = "valid" };
            var user = new ApplicationUser { Id = "1", UserName = "testuser", Email = "test@example.com", EmailConfirmed = true };

            _mockRecaptchaService.Setup(r => r.ValidateAsync(loginDto.ReCaptchaToken, default)).ReturnsAsync(true);
            _mockUserManager.Setup(u => u.FindByEmailAsync(loginDto.UsernameOrEmail)).ReturnsAsync(user);
            
            _mockSignInManager.Setup(s => s.PasswordSignInAsync(user, loginDto.Password, false, true))
                              .ReturnsAsync(SignInResult.Success);
            
            _mockUserManager.Setup(u => u.GetTwoFactorEnabledAsync(user)).ReturnsAsync(false);
            _mockUserManager.Setup(u => u.GetRolesAsync(user)).ReturnsAsync(new List<string> { "User" });
            
            _mockTokenService.Setup(t => t.GenerateJwtToken(user.Id, user.UserName, user.Email, It.IsAny<IList<string>>())).Returns("jwt-token");
            _mockTokenService.Setup(t => t.GenerateRefreshToken()).Returns("refresh-token");

            _mockMapper.Setup(m => m.Map<AuthResponseDto>(user)).Returns(new AuthResponseDto { Username = "testuser" });

            // Act
            var result = await _service.LoginAsync(loginDto, "TestDevice");

            // Assert
            result.Should().NotBeNull();
            result.ResponseDto.Token.Should().Be("jwt-token");
            result.RefreshToken.Should().Be("refresh-token");
            _mockUnitOfWork.Verify(u => u.RefreshToken.AddAsync(It.IsAny<RefreshToken>()), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Theory]
        [InlineData(true, true, true)]  // Valid scenario
        [InlineData(false, true, true)] // Invalid Token
        [InlineData(true, false, true)] // Is Revoked
        [InlineData(true, true, false)] // Expired
        public async Task RefreshAsync_ShouldValidateProperly(bool isValidToken, bool isNotRevoked, bool isNotExpired)
        {
            // Arrange
            var refreshTokenString = "some-token";
            var device = "TestDevice";

            var dbToken = (isValidToken && isNotRevoked && isNotExpired) ? new RefreshToken 
            { 
                UserId = "1", 
                Token = refreshTokenString, 
                IsRevoked = false, 
                ExpiresAt = DateTime.UtcNow.AddDays(1) 
            } : null; // If any invalid condition, mock FirstOrDefault to return null mimicking EF core where condition

            // Simulate EF Core expression filtering
            _mockUnitOfWork.Setup(u => u.RefreshToken.FirstOrDefaultAsync(
                It.IsAny<Expression<Func<RefreshToken, bool>>>(),
                It.IsAny<Func<IQueryable<RefreshToken>, IQueryable<RefreshToken>>>(),
                false))
                .ReturnsAsync(dbToken);

            if (dbToken == null)
            {
                // Act & Assert for failures
                await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.RefreshAsync(refreshTokenString, device));
            }
            else
            {
                var user = new ApplicationUser { Id = "1", UserName = "testuser", Email = "test@example.com", EmailConfirmed = true };
                _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
                _mockUserManager.Setup(u => u.GetRolesAsync(user)).ReturnsAsync(new List<string>());
                _mockTokenService.Setup(t => t.GenerateJwtToken(user.Id, user.UserName, user.Email, It.IsAny<IList<string>>())).Returns("new-jwt");
                _mockTokenService.Setup(t => t.GenerateRefreshToken()).Returns("new-refresh");
                _mockMapper.Setup(m => m.Map<AuthResponseDto>(user)).Returns(new AuthResponseDto());

                // Act
                var result = await _service.RefreshAsync(refreshTokenString, device);

                // Assert
                result.Should().NotBeNull();
                result.ResponseDto.Token.Should().Be("new-jwt");
                result.RefreshToken.Should().Be("new-refresh");
                dbToken.IsRevoked.Should().BeTrue();
                _mockUnitOfWork.Verify(u => u.RefreshToken.Update(dbToken), Times.Once);
                _mockUnitOfWork.Verify(u => u.RefreshToken.AddAsync(It.IsAny<RefreshToken>()), Times.Once);
                _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
            }
        }
    }

    public static class MockIdentityHelpers
    {
        public static Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
        {
            var store = new Mock<IUserStore<TUser>>();
            var mgr = new Mock<UserManager<TUser>>(store.Object, null, null, null, null, null, null, null, null);
            mgr.Object.UserValidators.Add(new UserValidator<TUser>());
            mgr.Object.PasswordValidators.Add(new PasswordValidator<TUser>());
            return mgr;
        }

        public static Mock<SignInManager<TUser>> MockSignInManager<TUser>(UserManager<TUser> userManager) where TUser : class
        {
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var claimsFactory = new Mock<IUserClaimsPrincipalFactory<TUser>>();
            return new Mock<SignInManager<TUser>>(
                userManager,
                contextAccessor.Object,
                claimsFactory.Object,
                new Mock<Microsoft.Extensions.Options.IOptions<IdentityOptions>>().Object,
                new Mock<Microsoft.Extensions.Logging.ILogger<SignInManager<TUser>>>().Object,
                new Mock<Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider>().Object,
                new Mock<IUserConfirmation<TUser>>().Object);
        }
    }
}
