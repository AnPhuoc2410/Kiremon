using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.WebUtilities;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TcgController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public TcgController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet("cards")]
        public async Task<IActionResult> GetCards([FromQuery] string q, [FromQuery] string orderBy, [FromQuery] int pageSize)
        {
            try
            {
                var apiKey = _configuration["TcgApiKey"] ?? "b9a3a622-75e4-4cd2-acc3-8b053cf4d6f4";
                
                var queryParams = new Dictionary<string, string?>
                {
                    { "q", q },
                    { "orderBy", orderBy },
                    { "pageSize", pageSize.ToString() }
                };

                var url = QueryHelpers.AddQueryString("cards", queryParams);
                
                // create client
                var client = _httpClientFactory.CreateClient("TcgApi");

                // Log for debugging
                Console.WriteLine($"[TCG Proxy] Requesting: {client.BaseAddress}{url}");

                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Add("X-Api-Key", apiKey);
                
                var response = await client.SendAsync(request);
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Content(content, "application/json");
                }
                
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[TCG Proxy] Error from API: {response.StatusCode} - {errorContent}");
                return StatusCode((int)response.StatusCode, errorContent);
            }
            catch (TaskCanceledException ex)
            {
                Console.WriteLine($"[TCG Proxy] Timeout: {ex.Message}");
                return StatusCode(504, new { message = "Request processed for too long and timed out", error = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TCG Proxy] Exception: {ex}");
                return StatusCode(500, new { message = "Error proxying TCG request", error = ex.Message });
            }
        }
    }
}
