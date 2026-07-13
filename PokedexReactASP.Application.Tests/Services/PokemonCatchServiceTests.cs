using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class PokemonCatchServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IPokemonCacheService> _mockPokemonCache;
        private readonly Mock<IPokemonEnricherService> _mockEnricher;
        private readonly Mock<IPokeApiService> _mockPokeApi;
        private readonly Mock<IPokemonFactoryService> _mockFactory;
        private readonly Mock<ICatchRateCalculatorService> _mockCatchRateCalc;
        private readonly Mock<IAchievementService> _mockAchievement;

        private readonly PokemonCatchService _service;

        // In-memory data
        private List<UserPokemon> _userPokemons;
        private List<UserBox> _userBoxes;

        public PokemonCatchServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUserManager = MockIdentityHelpers.MockUserManager<ApplicationUser>();
            _mockPokemonCache = new Mock<IPokemonCacheService>();
            _mockEnricher = new Mock<IPokemonEnricherService>();
            _mockPokeApi = new Mock<IPokeApiService>();
            _mockFactory = new Mock<IPokemonFactoryService>();
            _mockCatchRateCalc = new Mock<ICatchRateCalculatorService>();
            _mockAchievement = new Mock<IAchievementService>();

            _userPokemons = new List<UserPokemon>();
            _userBoxes = new List<UserBox>();

            SetupMockRepository(_mockUnitOfWork, _userPokemons, u => u.UserPokemon);
            SetupMockRepository(_mockUnitOfWork, _userBoxes, u => u.UserBox);

            _service = new PokemonCatchService(
                _mockUnitOfWork.Object,
                _mockUserManager.Object,
                _mockPokemonCache.Object,
                _mockEnricher.Object,
                _mockPokeApi.Object,
                _mockFactory.Object,
                _mockCatchRateCalc.Object,
                _mockAchievement.Object
            );
        }

        private void SetupMockRepository<T>(Mock<IUnitOfWork> mockUow, List<T> data, Expression<Func<IUnitOfWork, IRepository<T>>> repoSelector) where T : class
        {
            var mockRepo = new Mock<IRepository<T>>();
            
            // Setup FindAsync
            mockRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<T, bool>>>(), It.IsAny<bool>()))
                    .ReturnsAsync((Expression<Func<T, bool>> predicate, bool _) => data.Where(predicate.Compile()).ToList());
            
            // Setup FirstOrDefaultAsync
            mockRepo.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<T, bool>>>(), It.IsAny<bool>()))
                    .ReturnsAsync((Expression<Func<T, bool>> predicate, bool _) => data.FirstOrDefault(predicate.Compile()));

            // Setup AddAsync
            mockRepo.Setup(r => r.AddAsync(It.IsAny<T>())).Callback<T>(entity => data.Add(entity)).Returns(Task.CompletedTask);
            
            // Setup Remove
            mockRepo.Setup(r => r.Remove(It.IsAny<T>())).Callback<T>(entity => data.Remove(entity));

            mockUow.Setup(repoSelector).Returns(mockRepo.Object);
        }

        [Fact]
        public async Task AttemptCatch_ShouldReturnEscaped_WhenUserNotFound()
        {
            // Arrange
            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync((ApplicationUser)null);

            // Act
            var result = await _service.AttemptCatchPokemonAsync("1", new CatchAttemptDto());

            // Assert
            result.Result.Should().Be(CatchAttemptResult.Escaped);
            result.Message.Should().Be("Trainer not found");
        }

        [Fact]
        public async Task AttemptCatch_ShouldReturnEscaped_WhenPokemonNotFound()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1" };
            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
            _mockPokemonCache.Setup(p => p.GetPokemonAsync(1)).ReturnsAsync((PokeApiPokemon)null);

            // Act
            var result = await _service.AttemptCatchPokemonAsync("1", new CatchAttemptDto { PokemonApiId = 1 });

            // Assert
            result.Result.Should().Be(CatchAttemptResult.Escaped);
            result.Message.Should().Be("Pokemon not found");
        }

        [Fact]
        public async Task AttemptCatch_ShouldFailAndGrantBaseExp_WhenCatchCalcFails()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1", TrainerLevel = 5, CurrentLevelExperience = 0, TotalExperience = 0 };
            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
            
            var pokeData = new PokeApiPokemon { Name = "pikachu", Base_Experience = 112 }; // base exp = 20 max
            _mockPokemonCache.Setup(p => p.GetPokemonAsync(25)).ReturnsAsync(pokeData);
            _mockPokeApi.Setup(p => p.GetPokemonSpeciesAsync(25)).ReturnsAsync(new PokeApiSpeciesDetail { Capture_Rate = 45 });

            _mockCatchRateCalc.Setup(c => c.CalculateCatch(It.IsAny<CatchCalculationContext>()))
                .Returns(new CatchCalculationResult(CatchAttemptResult.Escaped, 2, 45.0, "It broke free!"));

            // Act
            var result = await _service.AttemptCatchPokemonAsync("1", new CatchAttemptDto { PokemonApiId = 25 });

            // Assert
            result.Result.Should().Be(CatchAttemptResult.Escaped);
            result.Message.Should().Be("It broke free!");
            result.TrainerExpGained.Should().Be(20); // 112/10 = 11, Max(20, 11) = 20
            user.CurrentLevelExperience.Should().Be(20);
        }

        [Fact]
        public async Task AttemptCatch_ShouldSucceed_AssignToParty_WhenPartyNotFull()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1", TrainerLevel = 5 };
            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
            
            var pokeData = new PokeApiPokemon { Name = "pikachu", Base_Experience = 112 };
            _mockPokemonCache.Setup(p => p.GetPokemonAsync(25)).ReturnsAsync(pokeData);
            _mockPokemonCache.Setup(p => p.GetPokemonBatchAsync(It.IsAny<IEnumerable<int>>())).ReturnsAsync(new Dictionary<int, PokeApiPokemon>());
            _mockPokeApi.Setup(p => p.GetPokemonSpeciesAsync(25)).ReturnsAsync(new PokeApiSpeciesDetail());

            _mockCatchRateCalc.Setup(c => c.CalculateCatch(It.IsAny<CatchCalculationContext>()))
                .Returns(new CatchCalculationResult(CatchAttemptResult.Success, 3, 100.0, null));

            var userPokemon = new UserPokemon { Id = 1, PokemonApiId = 25, UserId = "1" };
            _mockFactory.Setup(f => f.CreateCaughtPokemonAsync(It.IsAny<PokemonCreationContext>()))
                .ReturnsAsync(new PokemonCreationResult(userPokemon, new CaughtPokemonDto(), 500, true));

            // Populate party with only 2 pokemon
            _userPokemons.Add(new UserPokemon { UserId = "1", IsInParty = true, SlotIndex = 0 });
            _userPokemons.Add(new UserPokemon { UserId = "1", IsInParty = true, SlotIndex = 1 });

            // Act
            var result = await _service.AttemptCatchPokemonAsync("1", new CatchAttemptDto { PokemonApiId = 25 });

            // Assert
            result.Result.Should().Be(CatchAttemptResult.Success);
            _userPokemons.Should().Contain(p => p.Id == 1 && p.IsInParty == true && p.SlotIndex == 2);
            _mockAchievement.Verify(a => a.CheckAndUnlockAchievementsAsync("1"), Times.Once);
        }

        [Fact]
        public async Task AttemptCatch_ShouldSucceed_AssignToBox_WhenPartyIsFull()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1", TrainerLevel = 5 };
            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
            
            _mockPokemonCache.Setup(p => p.GetPokemonAsync(25)).ReturnsAsync(new PokeApiPokemon { Name = "pikachu" });
            _mockPokemonCache.Setup(p => p.GetPokemonBatchAsync(It.IsAny<IEnumerable<int>>())).ReturnsAsync(new Dictionary<int, PokeApiPokemon>());
            _mockPokeApi.Setup(p => p.GetPokemonSpeciesAsync(25)).ReturnsAsync(new PokeApiSpeciesDetail());

            _mockCatchRateCalc.Setup(c => c.CalculateCatch(It.IsAny<CatchCalculationContext>()))
                .Returns(new CatchCalculationResult(CatchAttemptResult.Success, 3, 100.0, null));

            var newPokemon = new UserPokemon { Id = 99, PokemonApiId = 25, UserId = "1" };
            _mockFactory.Setup(f => f.CreateCaughtPokemonAsync(It.IsAny<PokemonCreationContext>()))
                .ReturnsAsync(new PokemonCreationResult(newPokemon, new CaughtPokemonDto(), 500, true));

            // Populate party with 6 pokemon (full)
            for (int i = 0; i < 6; i++)
                _userPokemons.Add(new UserPokemon { UserId = "1", IsInParty = true, SlotIndex = i });

            // We need to setup a fake box returned from unit of work that supports Includes
            var mockBoxRepo = new Mock<IRepository<UserBox>>();
            var box = new UserBox { Id = 1, UserId = "1", Pokemons = new List<UserPokemon>() }; // Empty box
            _userBoxes.Add(box);

            // Setting up FindAsync with includes
            mockBoxRepo.Setup(r => r.FindAsync(
                It.IsAny<Expression<Func<UserBox, bool>>>(),
                It.IsAny<Func<IQueryable<UserBox>, IQueryable<UserBox>>>(),
                It.IsAny<bool>()))
                .ReturnsAsync(_userBoxes);
            _mockUnitOfWork.Setup(u => u.UserBox).Returns(mockBoxRepo.Object);

            // Act
            var result = await _service.AttemptCatchPokemonAsync("1", new CatchAttemptDto { PokemonApiId = 25 });

            // Assert
            result.Result.Should().Be(CatchAttemptResult.Success);
            _userPokemons.Should().Contain(p => p.Id == 99 && p.IsInParty == false && p.BoxId == 1 && p.SlotIndex == 0);
        }

        [Fact]
        public async Task ReleasePokemon_ShouldRemoveFromDb_AndUpdateTrainerStats()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1", PokemonCaught = 10, UniquePokemonCaught = 5 };
            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);

            var pokemonToRelease = new UserPokemon { Id = 1, UserId = "1", PokemonApiId = 25 };
            _userPokemons.Add(pokemonToRelease);

            // Act
            var result = await _service.ReleasePokemonAsync("1", 1);

            // Assert
            result.Should().BeTrue();
            _userPokemons.Should().NotContain(pokemonToRelease);
            user.PokemonCaught.Should().Be(9);
            _mockUserManager.Verify(u => u.UpdateAsync(user), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateNickname_ShouldDeduplicate_WhenNameExists()
        {
            // Arrange
            _userPokemons.Add(new UserPokemon { Id = 1, UserId = "1", PokemonApiId = 25, Nickname = "Sparky" });
            _userPokemons.Add(new UserPokemon { Id = 2, UserId = "1", PokemonApiId = 25, Nickname = null }); // Want to rename this to Sparky

            _mockPokemonCache.Setup(p => p.GetPokemonAsync(25)).ReturnsAsync(new PokeApiPokemon { Name = "pikachu" });
            _mockPokemonCache.Setup(p => p.GetPokemonBatchAsync(It.IsAny<IEnumerable<int>>())).ReturnsAsync(new Dictionary<int, PokeApiPokemon>());

            // Act
            var result = await _service.UpdatePokemonNicknameAsync("1", 2, "Sparky");

            // Assert
            result.Success.Should().BeTrue();
            result.ResultName.Should().Be("Sparky_1");
            _userPokemons.First(p => p.Id == 2).Nickname.Should().Be("Sparky_1");
        }

        [Fact]
        public async Task ToggleFavorite_ShouldFlipBoolean_AndSaveChanges()
        {
            // Arrange
            _userPokemons.Add(new UserPokemon { Id = 1, UserId = "1", IsFavorite = false });

            // Act
            var result = await _service.ToggleFavoritePokemonAsync("1", 1);

            // Assert
            result.Should().BeTrue();
            _userPokemons.First(p => p.Id == 1).IsFavorite.Should().BeTrue();
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateMoves_ShouldEnforceMax4Moves()
        {
            // Arrange
            var mockRepo = new Mock<IRepository<UserPokemon>>();
            var p = new UserPokemon { Id = 1, UserId = "1" };
            
            mockRepo.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<UserPokemon, bool>>>(), false))
                .ReturnsAsync(p);
            _mockUnitOfWork.Setup(u => u.UserPokemon).Returns(mockRepo.Object);

            // Act
            var result = await _service.UpdatePokemonMovesAsync("1", 1, new List<int> { 1, 2, 3, 4, 5 });

            // Assert
            result.Should().BeTrue();
            p.CustomMoveIds.Should().Be("1,2,3,4");
            mockRepo.Verify(r => r.Update(p), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
