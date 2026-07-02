using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PokedexReactASP.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly SymmetricSecurityKey _signingKey;
        private readonly SigningCredentials _signingCredentials;

        public TokenService(IOptions<JwtSettings> jwtOptions)
        {
            _jwtSettings        = jwtOptions.Value;
            _signingKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            _signingCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
        }

        public string GenerateJwtToken(string userId, string username, string email, IList<string>? roles = null)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub,        userId),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(JwtRegisteredClaimNames.Email,      email),
                new Claim(JwtRegisteredClaimNames.Jti,        Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier,          userId),
                new Claim(ClaimTypes.Name,                    username)
            };

            if (roles != null)
            {
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
            }

            var token = new JwtSecurityToken(
                issuer:             _jwtSettings.Issuer,
                audience:           _jwtSettings.Audience,
                claims:             claims,
                expires:            DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
                signingCredentials: _signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string? ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey        = _signingKey,
                    ValidateIssuer          = true,
                    ValidIssuer             = _jwtSettings.Issuer,
                    ValidateAudience        = true,
                    ValidAudience           = _jwtSettings.Audience,
                    ValidateLifetime        = true,
                    ClockSkew               = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                return jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Sub).Value;
            }
            catch
            {
                return null;
            }
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
