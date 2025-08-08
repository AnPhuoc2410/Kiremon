# Kiremon

A full-stack Pokémon application that allows users to explore Pokémon, catch them, manage their collection, battle with other trainers, and enjoy mini-games in a modern web interface.

## 🌟 Features

- **Pokémon Exploration**: Browse and search through the Pokémon database
- **Pokémon Catching**: Capture Pokémon to build your personal collection
- **Trainer Profiles**: Create and customize your trainer profile
- **Real-time Battles**: Battle with other trainers using WebSocket-based real-time communication
- **Mini-games**: Enjoy interactive mini-games within the Pokémon universe
- **Responsive UI**: Modern and responsive interface built with React and TailwindCSS

## 🧰 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS** for styling
- **React Router** for navigation
- **Radix UI** for accessible component primitives
- **Emotion** for component-scoped styling
- **Axios** for API calls
- **Lottie** animations for engaging UI experiences

### Backend
- **ASP.NET Core** Web API
- **Entity Framework Core** for data access
- **SQL Server** for database
- **Swagger/OpenAPI** for API documentation
- **Clean Architecture** pattern
  - Domain
  - Application
  - Infrastructure
  - Server (Web API)
- **Authentication & Authorization** with Keycloak

## 🏗️ Architecture Overview

The project follows Clean Architecture principles, separating concerns into distinct layers:

### Domain Layer
Contains enterprise business rules and entities like:
- Pokemon
- Trainer
- UserPokemon (join entity)

### Application Layer
Contains application-specific business rules, including:
- Services
- DTOs
- Interfaces for repositories, etc.

### Infrastructure Layer
Implements interfaces defined in the application layer:
- Database access (Entity Framework Core)
- External API integrations
- Migrations
- Persistence configuration

### Server (Web API) Layer
Contains the ASP.NET Core Web API controllers and configuration:
- API endpoints
- Authentication/Authorization
- API Documentation (Swagger)
- Configuration

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm/yarn
- SQL Server
- Docker (for Keycloak authentication service)

### Setting up the Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PokedexReactASP.git
   cd PokedexReactASP
   ```

2. **Set up the database**
   - Update the connection string in `appsettings.json` to point to your SQL Server instance
   - Run EF Core migrations to create the database:
     ```bash
     dotnet ef database update --project .\PokedexReactASP.Infrastructure --startup-project .\PokedexReactASP.Server
     ```

3. **Start the Keycloak authentication service**
   ```bash
   cd keycloak-service
   docker-compose up -d
   ```

4. **Install frontend dependencies**
   ```bash
   cd pokedexreactasp.client
   npm install
   ```

5. **Run the application**
   - Start the backend API:
     ```bash
     cd PokedexReactASP.Server
     dotnet run
     ```
   - In a separate terminal, start the frontend:
     ```bash
     cd pokedexreactasp.client
     npm run dev
     ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - API: https://localhost:7087
   - Swagger API documentation: https://localhost:7087/swagger

## 🧩 Project Structure

```
PokedexReactASP/
├── PokedexReactASP.Domain/          # Domain entities and business rules
│   └── Entities/
│       ├── Pokemon.cs
│       ├── Trainer.cs
│       └── UserPokemon.cs
├── PokedexReactASP.Application/     # Application business logic
│   ├── DTOs/
│   ├── Interfaces/
│   └── Services/
├── PokedexReactASP.Infrastructure/  # Infrastructure implementations
│   ├── Migrations/
│   └── Persistence/
│       └── ApplicationDbContext.cs
├── PokedexReactASP.Server/          # Web API
│   ├── Controllers/
│   ├── Program.cs
│   └── appsettings.json
├── pokedexreactasp.client/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.tsx
└── keycloak-service/                # Authentication service
```

## 📈 Future Enhancements

- Implement more mini-games
- Add Pokémon evolution mechanics
- Create a trading system
- Enhance battle system with more strategic options
- Add leaderboards and achievements
- Implement push notifications for battle invites

## 🔐 Authentication

The application uses Keycloak for authentication and authorization:
- User registration
- Login/Logout
- Role-based access control
- OAuth 2.0/OpenID Connect integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for Pokémon data
- Nintendo for creating the Pokémon universe