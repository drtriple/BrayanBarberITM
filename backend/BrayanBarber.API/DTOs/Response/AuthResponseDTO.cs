using BrayanBarber.Domain.Enums;

namespace BrayanBarber.API.DTOs.Response
{
    public class AuthResponseDTO
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }
}