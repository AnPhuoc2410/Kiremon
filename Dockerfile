# Use .NET SDK image to build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only server-related projects
COPY PokedexReactASP.Application/ PokedexReactASP.Application/
COPY PokedexReactASP.Domain/ PokedexReactASP.Domain/
COPY PokedexReactASP.Infrastructure/ PokedexReactASP.Infrastructure/
COPY PokedexReactASP.Server/ PokedexReactASP.Server/

# Restore and build
WORKDIR /src/PokedexReactASP.Server
RUN dotnet restore "PokedexReactASP.Server.csproj"
RUN dotnet publish "PokedexReactASP.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "PokedexReactASP.Server.dll"]
