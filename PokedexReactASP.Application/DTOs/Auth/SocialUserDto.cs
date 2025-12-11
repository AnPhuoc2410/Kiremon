using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.DTOs.Auth
{
    public class SocialUserDto
    {
        // --- Thông tin định danh ---
        public string Provider { get; set; } = string.Empty;    // "google", "facebook", "github"
        public string ProviderKey { get; set; } = string.Empty; // ID duy nhất (Subject ID)

        // --- Thông tin liên hệ ---
        public string Email { get; set; } = string.Empty;
        public bool IsEmailVerified { get; set; } = false;      // Quan trọng để biết có nên trust email này không

        // --- Thông tin cá nhân (Map vào FirstName/LastName của Trainer) ---
        public string FullName { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }                   // Github sẽ có cái này (login name)

        // --- Thông tin Profile (Map vào Bio, Avatar, Location của Trainer) ---
        public string? PictureUrl { get; set; }
        public string? Locale { get; set; }                     // Ví dụ: "vi", "en-US" -> Có thể dùng set ngôn ngữ game
        public string? Location { get; set; }                   // Github hay có (vd: "Hanoi, Vietnam") -> Map vào CurrentLocation?
        public string? Bio { get; set; }                        // Github có Bio -> Map vào Trainer Bio
        public string? ProfileLink { get; set; }                // Link đến trang cá nhân FB/Github
    }
}