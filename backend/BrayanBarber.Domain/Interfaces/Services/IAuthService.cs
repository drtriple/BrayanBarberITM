using BrayanBarber.Domain.Entities;

namespace BrayanBarber.Domain.Interfaces.Services
{
    public interface IAuthService
    {
        Task<User> LoginAsync(string username, string password);
        Task<User> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }
}