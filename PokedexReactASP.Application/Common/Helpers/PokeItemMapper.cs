using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.Options;

namespace PokedexReactASP.Application.Common.Helpers
{
    public class PokeItemMapper
    {
        private readonly ItemSystemSettings _itemSystemSettings;
        private readonly Dictionary<string, string> _overrides = new();
        private readonly ILogger _logger;

        public PokeItemMapper(IOptions<ItemSystemSettings> options, ILogger<PokeItemMapper> logger)
        {
            _itemSystemSettings = options.Value;
            _logger = logger;

            foreach (var pocket in _itemSystemSettings.PocketOverrides)
            {
                var pocketName = pocket.Key;
                var categories = pocket.Value;

                foreach (var category in categories)
                {
                    _overrides[category.ToLower()] = pocketName;
                }
                _logger.LogInformation("Loaded pocket override: {Pocket} for categories: {Categories}", pocketName, string.Join(", ", categories));
            }
        }

        public string ResolvePocket(string apiPocket, string apiCategory)
        {
            if (string.IsNullOrEmpty(apiCategory))
                return string.IsNullOrEmpty(apiPocket) ? "Other" : apiPocket;

            // 1. Check in custom overrides
            if (_overrides.TryGetValue(apiCategory.ToLower(), out var customPocket))
            {
                return customPocket;
            }

            // 2. Fallback to PokeAPI result
            return !string.IsNullOrEmpty(apiPocket) ? apiPocket : "Other";
        }

        public int DefaultBoxesCount => _itemSystemSettings.DefaultBoxesCount;
        public int BoxSlotsMax => _itemSystemSettings.BoxSlotsMax;


    }
}
