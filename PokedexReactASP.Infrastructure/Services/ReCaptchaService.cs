using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;

namespace PokedexReactASP.Infrastructure.Services
{
    public class ReCaptchaService : IRecaptchaService
    {
        private const string VerifyPath = "siteverify";

        private readonly HttpClient _httpClient;
        private readonly RecaptchaSettings _settings;
        private readonly ILogger<ReCaptchaService> _logger;
        private static readonly JsonSerializerOptions SerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public ReCaptchaService(
            HttpClient httpClient,
            IOptions<RecaptchaSettings> settings,
            ILogger<ReCaptchaService> logger)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            _httpClient.BaseAddress ??= new Uri("https://www.google.com/recaptcha/api/");
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.Timeout = TimeSpan.FromSeconds(10);
        }

        public async Task<bool> ValidateAsync(string token, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                _logger.LogWarning("reCAPTCHA token is missing or empty.");
                return false;
            }

            if (string.IsNullOrWhiteSpace(_settings.SecretKey))
            {
                _logger.LogError("reCAPTCHA secret key is not configured.");
                throw new InvalidOperationException("reCAPTCHA secret key is not configured.");
            }

            var payload = new Dictionary<string, string>
            {
                { "secret", _settings.SecretKey },
                { "response", token }
            };

            using var content = new FormUrlEncodedContent(payload);

            try
            {
                using var response = await _httpClient.PostAsync(VerifyPath, content, cancellationToken);
                response.EnsureSuccessStatusCode();

                var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
                var result = await JsonSerializer.DeserializeAsync<RecaptchaResponse>(stream, SerializerOptions, cancellationToken);

                if (result?.Success == true)
                {
                    return true;
                }

                _logger.LogWarning("reCAPTCHA verification failed. Errors: {Errors}", string.Join(",", result?.ErrorCodes ?? []));
                return false;
            }
            catch (TaskCanceledException ex) when (ex.InnerException is TimeoutException)
            {
                _logger.LogWarning(ex, "reCAPTCHA verification timed out.");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error when verifying reCAPTCHA.");
                return false;
            }
        }

        private sealed class RecaptchaResponse
        {
            public bool Success { get; set; }

            public decimal? Score { get; set; }

            public string? Action { get; set; }

            public List<string>? ErrorCodes { get; set; }
        }
    }
}

