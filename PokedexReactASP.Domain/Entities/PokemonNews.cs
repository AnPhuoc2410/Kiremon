namespace PokedexReactASP.Domain.Entities
{
    public class PokemonNews
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string SourceUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int ViewCount { get; set; } = 0;
        public int CommentCount { get; set; } = 0;
        public DateTime PublishedDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}