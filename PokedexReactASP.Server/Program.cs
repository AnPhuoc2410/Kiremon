using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Mappings;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Application.Services.GameMechanics;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure;
using PokedexReactASP.Infrastructure.Persistence;
using PokedexReactASP.Infrastructure.Services;
using PokedexReactASP.Server.Hubs;
using PokedexReactASP.Server.Middleware;
using PokedexReactASP.Server.Seed;
using System.Text;

namespace PokedexReactASP.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            builder.Services.AddInfrastructure(builder.Configuration);

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;

                options.User.RequireUniqueEmail = true;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
            })
            .AddEntityFrameworkStores<PokemonDbContext>()
            .AddDefaultTokenProviders();

            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                // Configure JWT for SignalR
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

            // Add Authorization
            builder.Services.AddAuthorization();

            builder.Services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile(new MappingProfile());
            });

            builder.Services.AddMemoryCache();

            // Add Application Services
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddHttpClient<IPokeApiService, PokeApiService>();
            builder.Services.AddScoped<IPokemonService, PokemonService>();

            builder.Services.AddSingleton<IPokemonCacheService, PokemonCacheService>();
            builder.Services.AddScoped<IPokemonEnricherService, PokemonEnricherService>();
            builder.Services.AddScoped<IUserService, UserService>();

            // Game Mechanics Services
            builder.Services.AddSingleton<IIVGeneratorService, IVGeneratorService>();
            builder.Services.AddSingleton<IShinyRollerService, ShinyRollerService>();
            builder.Services.AddSingleton<INatureGeneratorService, NatureGeneratorService>();
            builder.Services.AddSingleton<ICatchRateCalculatorService, CatchRateCalculatorService>();
            builder.Services.AddScoped<IPokemonFactoryService, PokemonFactoryService>();

            builder.Services.Configure<OAuth2Settings>(builder.Configuration.GetSection(OAuth2Settings.SectionName));
            builder.Services.AddScoped<ISocialAuthService, SocialVerifyService>();
            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
            builder.Services.Configure<RecaptchaSettings>(builder.Configuration.GetSection(RecaptchaSettings.SectionName));
            builder.Services.AddHttpClient<IRecaptchaService, ReCaptchaService>(client =>
            {
                client.BaseAddress = new Uri("https://www.google.com/recaptcha/api/");
                client.Timeout = TimeSpan.FromSeconds(10);
            });


            // Add SignalR
            builder.Services.AddSignalR();

            // Add Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "Kiremon API",
                    Version = "v1",
                    Description = "API for Kiremon application",
                    TermsOfService = new Uri("https://kiremon.vercel.app/terms"),
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact
                    {
                        Name = "Kiremon Dev",
                        Email = "storephuoc@gmail.com",
                        Url = new Uri("https://kiremon.vercel.app"),
                    },
                    License = new Microsoft.OpenApi.Models.OpenApiLicense
                    {
                        Name = "MIT License",
                        Url = new Uri("https://opensource.org/licenses/MIT")
                    }
                });

                // Add JWT Authentication to Swagger
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Input JWT."
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
            {
                {
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                    {
                         Reference = new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                    }
                });
            });

            var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
            builder.Services
                .AddCors(options =>
                {
                    options.AddPolicy("AllowReactApp", policy =>
                    {
                        policy.WithOrigins(allowedOrigins ?? [])
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
                })
                .ConfigureApplicationCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(30);
                    if (builder.Environment.IsDevelopment())
                    {
                        options.Cookie.SameSite = SameSiteMode.Lax;

                        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                    }
                    else
                    {
                        options.Cookie.SameSite = SameSiteMode.None;
                        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    }
                });



            var app = builder.Build();

            IdentitySeeder.SeedAsync(app.Services, builder.Configuration, app.Environment.IsDevelopment(), app.Logger).Wait();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            // Enable Swagger with authentication protection
            if (!app.Environment.IsDevelopment())
            {
                app.UseMiddleware<SwaggerAuthMiddleware>();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Pokedex API v1");
                c.RoutePrefix = "swagger";
                c.DocumentTitle = "Pokédex API Documentation";
                c.InjectStylesheet("/swagger-custom.css");
                c.InjectJavascript("/swagger-custom.js");
                c.DefaultModelsExpandDepth(-1);
                c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
            });

            app.UseHttpsRedirection();

            app.UseCors("AllowReactApp");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.MapHub<PokemonHub>("/hubs/pokemon");

            // Health check endpoint for Docker/Load Balancer
            app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

            app.MapFallbackToFile("/index.html");

            app.Run();
        }

    }
}
