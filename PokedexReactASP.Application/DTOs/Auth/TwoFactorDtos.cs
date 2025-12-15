using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.DTOs.Auth
{
    public class TwoFactorDto
    {
        public string SharedKey { get; set; }
        public string QrCodeUri { get; set; }
    }

    public class  Enable2FADto
    {
        public string Code { get; set; }
    }
    public class TwoFactorLoginDto
    {
        public string UserId { get; set; }
        public string Code { get; set; }
    }
    public class Disable2FADto
    {
        public string Code { get; set; }
    }
}
