using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.Options
{
    public class OAuth2Settings
    {
        public const string SectionName = "OAuth";
        public GoogleSettings Google { get; set; } = new ();
        public FacebookSettings Facebook { get; set; } = new ();
        public GithubSettings Github { get; set; } = new ();

    }

    public class GoogleSettings
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
    }

    public class FacebookSettings
    {
        public string AppId { get; set; } = string.Empty;
        public string AppSecret { get; set; } = string.Empty;
    }

    public class GithubSettings
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
    }
}
