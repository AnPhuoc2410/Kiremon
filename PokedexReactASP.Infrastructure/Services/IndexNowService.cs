using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Infrastructure.Services
{
    public class IndexNowService : IIndexNowService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<IndexNowService> _logger;

        private const string Host = "kiremon.vercel.app";
        private const string Key = "d31eeb2fbd354b689017fdc88db738aa";
        private const string KeyLocation = "https://kiremon.vercel.app/d31eeb2fbd354b689017fdc88db738aa.txt";

        public IndexNowService(
            HttpClient httpClient,
            ILogger<IndexNowService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task SubmitUrlsAsync(IEnumerable<string> urls, CancellationToken cancellationToken = default)
        {
            try
            {
                var payload = new
                {
                    host = Host,
                    key = Key,
                    keyLocation = KeyLocation,
                    urlList = urls
                };

                _logger.LogInformation("Submitting URLs to IndexNow API for host {Host}", Host);

                var response = await _httpClient.PostAsJsonAsync("https://api.indexnow.org/indexnow", payload, cancellationToken);
                
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Successfully submitted URLs to IndexNow.");
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogWarning("IndexNow API returned status {StatusCode}: {Error}", response.StatusCode, error);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to submit URLs to IndexNow API.");
            }
        }
    }
}
