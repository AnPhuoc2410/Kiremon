namespace PokedexReactASP.Application.Common.Helpers
{
    public static class TrainerLevelCalculator
    {
        /// <summary>
        /// Returns the total experience points required to advance past <paramref name="currentLevel"/>.
        /// Formula: 1000 + (currentLevel * 100).
        /// </summary>
        /// <param name="currentLevel">The trainer's current level.</param>
        /// <returns>Experience threshold for the next level.</returns>
        public static int GetExpForNextLevel(int currentLevel) => 1000 + (currentLevel * 100);
    }
}
