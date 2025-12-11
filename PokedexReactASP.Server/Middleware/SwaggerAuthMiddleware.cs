using System.Net;
using System.Text;

namespace PokedexReactASP.Server.Middleware
{
    public class SwaggerAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public SwaggerAuthMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Only protect Swagger in production
            if (context.Request.Path.StartsWithSegments("/swagger"))
            {
                // Get credentials from configuration
                var swaggerUsername = _configuration["Swagger:Username"];
                var swaggerPassword = _configuration["Swagger:Password"];

                // If credentials are not configured, deny access in production
                if (string.IsNullOrEmpty(swaggerUsername) || string.IsNullOrEmpty(swaggerPassword))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    await context.Response.WriteAsync("Swagger is disabled. Configure Swagger:Username and Swagger:Password to enable.");
                    return;
                }

                // Check for Authorization header
                string? authHeader = context.Request.Headers["Authorization"];
                if (authHeader != null && authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
                {
                    // Extract credentials
                    var encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();
                    var encoding = Encoding.UTF8;
                    var usernamePassword = encoding.GetString(Convert.FromBase64String(encodedUsernamePassword));
                    var separatorIndex = usernamePassword.IndexOf(':');

                    if (separatorIndex >= 0)
                    {
                        var username = usernamePassword.Substring(0, separatorIndex);
                        var password = usernamePassword.Substring(separatorIndex + 1);

                        // Validate credentials
                        if (username == swaggerUsername && password == swaggerPassword)
                        {
                            await _next.Invoke(context);
                            return;
                        }
                    }
                }

                // Return authentication challenge
                context.Response.Headers["WWW-Authenticate"] = "Basic realm=\"Swagger Documentation\"";
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsync("Access denied. Please provide valid credentials.");
            }
            else
            {
                await _next.Invoke(context);
            }
        }
    }
}
