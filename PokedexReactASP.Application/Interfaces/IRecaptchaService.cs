namespace PokedexReactASP.Application.Interfaces
{
    public interface IRecaptchaService
    {
        Task<bool> ValidateAsync(string token, CancellationToken cancellationToken = default);
    }
}

