namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Complete IV set for a Pokemon (0-31 each)
    /// </summary>
    public record IVSet(
        int Hp,
        int Attack,
        int Defense,
        int SpecialAttack,
        int SpecialDefense,
        int Speed)
    {
        public int Total => Hp + Attack + Defense + SpecialAttack + SpecialDefense + Speed;
        public double Percentage => Total / 186.0 * 100;

        public (string Name, int Value) GetBestStat()
        {
            var stats = new[] 
            { 
                ("HP", Hp), 
                ("Attack", Attack), 
                ("Defense", Defense),
                ("Sp. Attack", SpecialAttack),
                ("Sp. Defense", SpecialDefense),
                ("Speed", Speed)
            };
            return stats.MaxBy(s => s.Item2);
        }

        public string GetVerdict() => Total switch
        {
            >= 186 => "Perfect!",
            >= 170 => "Outstanding!",
            >= 150 => "Amazing",
            >= 120 => "Great",
            >= 90 => "Good",
            >= 60 => "Decent",
            _ => "Not bad"
        };
    }
}
