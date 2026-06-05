using System.Security.Cryptography;

namespace PokedexReactASP.Application.Common.Helpers
{
    /// <summary>
    /// Generates friend codes in the format XXXX-XXXX-XXXX (12 characters).
    /// </summary>
    public static class FriendCodeHelper
    {
        private const string AllowedChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        public static string Generate()
        {
            var code = new char[12];
            for (int i = 0; i < 12; i++)
            {
                code[i] = AllowedChars[RandomNumberGenerator.GetInt32(AllowedChars.Length)];
            }
            return $"{new string(code, 0, 4)}-{new string(code, 4, 4)}-{new string(code, 8, 4)}";
        }
    }
}
