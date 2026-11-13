using System.Text.Json;
using FluentAssertions;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using PokedexReactASP.Infrastructure.Services;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class ResilientCacheServiceTests : IDisposable
    {
        private readonly Mock<IDistributedCache> _mockDistributedCache;
        private readonly IMemoryCache _memoryCache;
        private readonly Mock<ILogger<ResilientCacheService>> _mockLogger;
        private readonly ResilientCacheService _service;

        private record TestPayload(string Name, int Value);

        public ResilientCacheServiceTests()
        {
            _mockDistributedCache = new Mock<IDistributedCache>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _mockLogger = new Mock<ILogger<ResilientCacheService>>();
            _service = new ResilientCacheService(_mockDistributedCache.Object, _memoryCache, _mockLogger.Object);
        }

        public void Dispose()
        {
            _memoryCache.Dispose();
        }

        [Fact]
        public async Task GetAsync_WhenL1MemoryCacheHit_ShouldReturnDirectlyWithoutCheckingL2()
        {
            // Arrange
            var payload = new TestPayload("Pikachu", 25);
            _memoryCache.Set("test_key", payload);

            // Act
            var result = await _service.GetAsync<TestPayload>("test_key");

            // Assert
            result.Should().BeEquivalentTo(payload);
            _mockDistributedCache.Verify(d => d.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task GetAsync_WhenL1MissAndL2Hit_ShouldReturnDeserializedAndPopulateL1()
        {
            // Arrange
            var payload = new TestPayload("Charizard", 6);
            var json = JsonSerializer.Serialize(payload);
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);

            _mockDistributedCache.Setup(d => d.GetAsync("test_key", It.IsAny<CancellationToken>()))
                .ReturnsAsync(bytes);

            // Act - First call: L1 miss, L2 hit
            var result = await _service.GetAsync<TestPayload>("test_key");

            // Assert
            result.Should().BeEquivalentTo(payload);
            _mockDistributedCache.Verify(d => d.GetAsync("test_key", It.IsAny<CancellationToken>()), Times.Once);

            // Act - Second call: Should hit L1 now
            var secondResult = await _service.GetAsync<TestPayload>("test_key");
            secondResult.Should().BeEquivalentTo(payload);
            // Verify L2 was not called a second time
            _mockDistributedCache.Verify(d => d.GetAsync("test_key", It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetAsync_WhenRedisThrowsException_ShouldHandleGracefullyAndReturnNull()
        {
            // Arrange
            _mockDistributedCache.Setup(d => d.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new InvalidOperationException("Redis connection error"));

            // Act
            var result = await _service.GetAsync<TestPayload>("failing_key");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task SetAsync_ShouldPopulateL1MemoryCacheAndL2DistributedCache()
        {
            // Arrange
            var payload = new TestPayload("Squirtle", 7);

            // Act
            await _service.SetAsync("squirtle_key", payload, TimeSpan.FromMinutes(5));

            // Assert
            _memoryCache.TryGetValue("squirtle_key", out TestPayload? l1Val).Should().BeTrue();
            l1Val.Should().BeEquivalentTo(payload);

            _mockDistributedCache.Verify(d => d.SetAsync(
                "squirtle_key",
                It.IsAny<byte[]>(),
                It.IsAny<DistributedCacheEntryOptions>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task SetAsync_WhenRedisFails_ShouldStillUpdateL1MemoryCache()
        {
            // Arrange
            var payload = new TestPayload("Bulbasaur", 1);
            _mockDistributedCache.Setup(d => d.SetAsync(
                It.IsAny<string>(),
                It.IsAny<byte[]>(),
                It.IsAny<DistributedCacheEntryOptions>(),
                It.IsAny<CancellationToken>()))
                .ThrowsAsync(new InvalidOperationException("Redis down"));

            // Act
            await _service.SetAsync("bulbasaur_key", payload);

            // Assert
            _memoryCache.TryGetValue("bulbasaur_key", out TestPayload? l1Val).Should().BeTrue();
            l1Val.Should().BeEquivalentTo(payload);
        }

        [Fact]
        public void Remove_ShouldRemoveFromBothL1AndL2()
        {
            // Arrange
            var payload = new TestPayload("Mewtwo", 150);
            _memoryCache.Set("mewtwo_key", payload);

            // Act
            _service.Remove("mewtwo_key");

            // Assert
            _memoryCache.TryGetValue("mewtwo_key", out _).Should().BeFalse();
            _mockDistributedCache.Verify(d => d.Remove("mewtwo_key"), Times.Once);
        }
    }
}

