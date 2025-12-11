using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.Common.Enum;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Nodes;
using Http = System.Net.Http;

namespace PokedexReactASP.Infrastructure.Services
{
    public class SocialVerifyService : ISocialAuthService
    {
        private readonly OAuth2Settings _oAuth2Settings;
        private readonly Http.IHttpClientFactory _httpClientFactory;
        public SocialVerifyService(IOptions<OAuth2Settings> configuration, Http.IHttpClientFactory httpClientFactory)
        {
            _oAuth2Settings = configuration.Value;
            _httpClientFactory = httpClientFactory;
        }
        public async Task<SocialUserDto> VerifyTokenAsync(string provider, string token)
        {
            var p = provider.ToLower().Trim();
            switch (p)
            {
                case "google":
                    return await VerifyGoogleTokenAsync(token);
                case "facebook":
                    return await VerifyFacebookTokenAsync(token);
                case "github":
                    return await VerifyGithubTokenAsync(token);
                default:
                    throw new NotSupportedException($"The provider '{provider}' is not supported.");
            }
        }

        // --- 1. GOOGLE (Dùng thư viện Google.Apis.Auth) ---
        private async Task<SocialUserDto> VerifyGoogleTokenAsync(string token)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _oAuth2Settings.Google.ClientId }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);

                var (fallbackFirstName, fallbackLastName) = SplitName(payload.Name);

                return new SocialUserDto
                {
                    Provider = AuthProvider.Google.ToString().ToLower(),
                    ProviderKey = payload.Subject,
                    Email = payload.Email,
                    IsEmailVerified = payload.EmailVerified,
                    FullName = payload.Name,
                    FirstName = payload.GivenName ?? fallbackFirstName,
                    LastName = payload.FamilyName ?? fallbackLastName,
                    Username = payload.Email.Split('@')[0],
                    PictureUrl = payload.Picture,
                    Locale = payload.Locale
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Google token verification failed.", ex);
            }
        }

        private async Task<SocialUserDto> VerifyFacebookTokenAsync(string token)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();

                var appSecret = _oAuth2Settings.Facebook.AppSecret;

                var proof = GenerateAppSecretProof(token, appSecret);

                var fields = "id,name,email,first_name,last_name,picture.width(500).height(500),locale,link,location";

                var requestUrl = $"https://graph.facebook.com/me?fields={fields}&access_token={token}&appsecret_proof={proof}";

                var response = await client.GetAsync(requestUrl);

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception("Facebook token verification failed.");
                }

                var jsonString = await response.Content.ReadAsStringAsync();
                var node = JsonNode.Parse(jsonString);

                if(node == null) 
                    throw new Exception("Parsing Facebook response failed.");

                var (fallbackFirstName, fallbackLastName) = SplitName(node["name"]?.ToString() ?? "");

                return new SocialUserDto
                {
                    Provider = AuthProvider.Facebook.ToString().ToLower(),
                    ProviderKey = node["id"]?.ToString() ?? "",
                    Email = node["email"]?.ToString() ?? "",
                    IsEmailVerified = node["email"] != null,

                    FullName = node["name"]?.ToString() ?? "",
                    FirstName = node["first_name"]?.ToString() ?? fallbackFirstName,
                    LastName = node["last_name"]?.ToString() ?? fallbackLastName,

                    // Truy cập lồng nhau cực gọn: picture -> data -> url
                    PictureUrl = node["picture"]?["data"]?["url"]?.ToString(),

                    Locale = node["locale"]?.ToString(),
                    ProfileLink = node["link"]?.ToString(),
                    Location = node["location"]?["name"]?.ToString(),

                    // Logic Username cũ
                    Username = node["email"] != null
                   ? node["email"].ToString().Split('@')[0]
                   : node["id"].ToString()
                };

            }
            catch (Exception ex)
            {
                throw new Exception (ex.Message);
            }
        }

        private async Task<SocialUserDto> VerifyGithubTokenAsync(string token)
        {

            throw new NotImplementedException();
        }

        private (string First, string Last) SplitName(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName)) return ("", "");
            
            var parts = fullName.Trim().Split(' ');
            if (parts.Length == 1) return (parts[0], "");
            
            var last = parts[^1];
            var first = string.Join (" ", parts.Take(parts.Length - 1));
            return (first, last);
        }

        private string GenerateAppSecretProof(string accessToken, string appSecret)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(appSecret)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(accessToken));
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
    }
}
