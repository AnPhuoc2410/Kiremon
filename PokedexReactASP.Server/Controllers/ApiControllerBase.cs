using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class ApiControllerBase : ControllerBase
    {
        protected string CurrentUserId =>
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
    }
}
