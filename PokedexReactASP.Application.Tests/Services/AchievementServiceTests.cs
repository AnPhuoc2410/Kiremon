using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;
using PokedexReactASP.Application.DTOs.Achievement;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class AchievementServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<ICacheService> _mockCache;
        private readonly Mock<IAchievementNotificationService> _mockNotificationService;
        private readonly AchievementService _achievementService;

        public AchievementServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();

            // Mock UserManager
            var store = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);

            _mockCache = new Mock<ICacheService>();
            _mockNotificationService = new Mock<IAchievementNotificationService>();

            _achievementService = new AchievementService(
                _mockUnitOfWork.Object,
                _mockUserManager.Object,
                _mockCache.Object,
                _mockNotificationService.Object
            );
        }

        [Fact]
        public async Task GetUserAchievementsAsync_ShouldReturnCachedData_WhenCacheExists()
        {
            // Arrange
            var userId = "user1";
            var cacheKey = $"achievements:{userId}";
            var cachedData = new List<UserAchievementStatusDto>
            {
                new UserAchievementStatusDto { Id = "test_achievement", Name = "Test" }
            };

            _mockCache.Setup(c => c.GetAsync<List<UserAchievementStatusDto>>(cacheKey))
                      .ReturnsAsync(cachedData);

            // Act
            var result = await _achievementService.GetUserAchievementsAsync(userId);

            // Assert
            result.Should().BeEquivalentTo(cachedData);
            _mockUserManager.Verify(u => u.FindByIdAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task UnlockAchievementManuallyAsync_ShouldReturnFalse_WhenAchievementNotFound()
        {
            // Arrange
            var userId = "user1";
            var achievementId = "invalid_achievement"; // Not in DefaultAchievements

            // Act
            var result = await _achievementService.UnlockAchievementManuallyAsync(userId, achievementId);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task GetUserAchievementsAsync_ShouldFetchFromDbAndCalculate_WhenNoCache()
        {
            // Arrange
            var userId = "user1";
            var cacheKey = $"achievements:{userId}";
            var user = new ApplicationUser { Id = userId, TrainerLevel = 6, PokemonCaught = 15 };

            _mockCache.Setup(c => c.GetAsync<List<UserAchievementStatusDto>>(cacheKey))
                      .ReturnsAsync((List<UserAchievementStatusDto>)null);

            _mockUserManager.Setup(m => m.FindByIdAsync(userId)).ReturnsAsync(user);

            var dbAchievements = new List<UserAchievement>
            {
                new UserAchievement { AchievementId = "level_5", Progress = 5, IsUnlocked = true }
            };

            _mockUnitOfWork.Setup(u => u.UserAchievement.FindAsync(
                It.IsAny<System.Linq.Expressions.Expression<System.Func<UserAchievement, bool>>>(),
                true))
                .ReturnsAsync(dbAchievements);

            // Act
            var result = (await _achievementService.GetUserAchievementsAsync(userId)).ToList();

            // Assert
            result.Should().NotBeEmpty();
            var level5 = result.FirstOrDefault(a => a.Id == "level_5");
            level5.Should().NotBeNull();
            level5.IsUnlocked.Should().BeTrue();

            var level10 = result.FirstOrDefault(a => a.Id == "level_10");
            level10.Should().NotBeNull();
            level10.IsUnlocked.Should().BeFalse();
            level10.CurrentProgress.Should().Be(6); // Dynamically calculated from TrainerLevel
            
            _mockCache.Verify(c => c.SetAsync(cacheKey, It.IsAny<List<UserAchievementStatusDto>>(), It.IsAny<System.TimeSpan>()), Times.Once);
        }

        [Fact]
        public async Task CheckAndUnlockAchievementsAsync_ShouldUnlockNewAchievements_WhenConditionsMet()
        {
            // Arrange
            var userId = "user1";
            var user = new ApplicationUser { Id = userId, TrainerLevel = 5, Coins = 0 };

            _mockUserManager.Setup(m => m.FindByIdAsync(userId)).ReturnsAsync(user);

            // No previous achievements
            _mockUnitOfWork.Setup(u => u.UserAchievement.FindAsync(
                It.IsAny<System.Linq.Expressions.Expression<System.Func<UserAchievement, bool>>>(),
                false))
                .ReturnsAsync(new List<UserAchievement>());

            // Act
            await _achievementService.CheckAndUnlockAchievementsAsync(userId);

            // Assert
            _mockUnitOfWork.Verify(u => u.UserAchievement.AddAsync(It.IsAny<UserAchievement>()), Times.AtLeastOnce);
            _mockUserManager.Verify(u => u.UpdateAsync(user), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
            
            user.Coins.Should().BeGreaterThan(0); // Should have received coins for level 5
        }

        [Fact]
        public async Task UnlockAchievementManuallyAsync_ShouldUnlock_WhenValid()
        {
            // Arrange
            var userId = "user1";
            var achievementId = "level_5";
            var user = new ApplicationUser { Id = userId, Coins = 0 };

            _mockUserManager.Setup(m => m.FindByIdAsync(userId)).ReturnsAsync(user);

            _mockUnitOfWork.Setup(u => u.UserAchievement.FirstOrDefaultAsync(
                It.IsAny<System.Linq.Expressions.Expression<System.Func<UserAchievement, bool>>>(),
                false))
                .ReturnsAsync((UserAchievement)null);

            // Act
            var result = await _achievementService.UnlockAchievementManuallyAsync(userId, achievementId);

            // Assert
            result.Should().BeTrue();
            _mockUnitOfWork.Verify(u => u.UserAchievement.AddAsync(It.IsAny<UserAchievement>()), Times.Once);
            _mockUserManager.Verify(u => u.UpdateAsync(user), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
