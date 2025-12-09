namespace PokedexReactASP.Application.Options
{
    public class RecaptchaSettings
    {
        public const string SectionName = "RecaptchaSettings";

        public string SecretKey { get; set; } = string.Empty;
    }
}

