using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IIndexNowService
    {
        Task SubmitUrlsAsync(IEnumerable<string> urls, CancellationToken cancellationToken = default);
    }
}
