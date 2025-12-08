using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendWelcomeConfirmationAsync(ApplicationUser user, string confirmationLink);
        Task SendPasswordResetAsync(ApplicationUser user, string resetLink, string token);
    }
}

