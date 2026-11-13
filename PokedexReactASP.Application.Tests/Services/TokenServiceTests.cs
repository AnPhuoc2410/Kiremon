using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FluentAssertions;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Infrastructure.Services;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class TokenServiceTests
    {
        private readonly TokenService _tokenService;
        private readonly JwtSettings _jwtSettings;

        public TokenServiceTests()
        {
            _jwtSettings = new JwtSettings
            {
                SecretKey = "SuperSecretKeyForTestingPurposesMustBeLongEnough123456!",
                Issuer = "TestIssuer",
                Audience = "TestAudience",
                ExpirationMinutes = 60,
                RefreshTokenExpirationDays = 7
            };

            var options = Microsoft.Extensions.Options.Options.Create(_jwtSettings);
            _tokenService = new TokenService(options);
        }

        [Fact]
        public void GenerateJwtToken_ShouldGenerateValidTokenWithCorrectClaims()
        {
            // Arrange
            var userId = "user123";
            var username = "ash_ketchum";
            var email = "ash@pallet.town";
            var roles = new List<string> { "Trainer", "Champion" };

            // Act
            var tokenString = _tokenService.GenerateJwtToken(userId, username, email, roles);

            // Assert
            tokenString.Should().NotBeNullOrWhiteSpace();

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(tokenString);

            jwt.Issuer.Should().Be(_jwtSettings.Issuer);
            jwt.Audiences.Should().Contain(_jwtSettings.Audience);
            jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == userId);
            jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.UniqueName && c.Value == username);
            jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Email && c.Value == email);
            jwt.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value)
                .Should().BeEquivalentTo(roles);
        }

        [Fact]
        public void ValidateToken_WithValidToken_ShouldReturnUserId()
        {
            // Arrange
            var userId = "user123";
            var tokenString = _tokenService.GenerateJwtToken(userId, "ash", "ash@pallet.town");

            // Act
            var validatedUserId = _tokenService.ValidateToken(tokenString);

            // Assert
            validatedUserId.Should().Be(userId);
        }

        [Fact]
        public void ValidateToken_WithInvalidOrTamperedToken_ShouldReturnNull()
        {
            // Arrange
            var tokenString = "invalid.token.string";

            // Act
            var result = _tokenService.ValidateToken(tokenString);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public void ValidateToken_WithTokenFromDifferentKey_ShouldReturnNull()
        {
            // Arrange
            var differentSettings = new JwtSettings
            {
                SecretKey = "AnotherSuperSecretKeyForTestingDifferentKeys1234567!",
                Issuer = "TestIssuer",
                Audience = "TestAudience",
                ExpirationMinutes = 60
            };
            var anotherTokenService = new TokenService(Microsoft.Extensions.Options.Options.Create(differentSettings));
            var token = anotherTokenService.GenerateJwtToken("user123", "ash", "ash@pallet.town");

            // Act
            var result = _tokenService.ValidateToken(token);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public void GenerateRefreshToken_ShouldReturnUniqueBase64Strings()
        {
            // Act
            var token1 = _tokenService.GenerateRefreshToken();
            var token2 = _tokenService.GenerateRefreshToken();

            // Assert
            token1.Should().NotBeNullOrWhiteSpace();
            token2.Should().NotBeNullOrWhiteSpace();
            token1.Should().NotBe(token2);

            // 64 bytes converted to base64 = 88 characters
            token1.Length.Should().Be(88);
            Convert.FromBase64String(token1).Length.Should().Be(64);
        }
    }
}

