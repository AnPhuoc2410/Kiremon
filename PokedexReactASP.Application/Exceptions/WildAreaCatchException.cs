namespace PokedexReactASP.Application.Exceptions
{
    public class WildAreaCatchException : Exception
    {
        public int StatusCode { get; }

        public WildAreaCatchException(int statusCode, string message) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
