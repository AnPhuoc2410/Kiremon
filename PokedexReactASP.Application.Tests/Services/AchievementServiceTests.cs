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
    }
}
