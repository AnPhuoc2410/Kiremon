using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.DTOs.Auth
{
    public class TwoFactorDto
    {
        public string SharedKey { get; set; } = string.Empty;
        public string QrCodeUri { get; set; } = string.Empty;
    }

    public class Enable2FADto
    {
        public string Code { get; set; } = string.Empty;
    }
    public class TwoFactorLoginDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public bool RememberMe { get; set; }
    }
    public class Disable2FADto
    {
        public string Code { get; set; } = string.Empty;
    }
}
