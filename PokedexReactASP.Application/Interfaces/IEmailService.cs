using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendWelcomeConfirmationAsync(ApplicationUser user, string confirmationLink);
        Task SendExternalWelcomeConfirmationAsync(ApplicationUser user, string confirmationLink, string provider);
        Task SendPasswordResetAsync(ApplicationUser user, string resetLink, string token);
    }
}

