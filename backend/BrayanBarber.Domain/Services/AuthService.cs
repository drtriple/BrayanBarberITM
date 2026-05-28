using BrayanBarber.Domain.Entities;
using BrayanBarber.Domain.Enums;
using BrayanBarber.Domain.Interfaces.Repositories;
using BrayanBarber.Domain.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace BrayanBarber.Domain.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<User> LoginAsync(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                throw new InvalidOperationException(
                    "El usuario y la contraseña son obligatorios");

            var user = await _userRepository.GetByUsernameAsync(username);

            if (user == null)
            {
                _logger.LogWarning("Login failed: user '{Username}' not found", username);
                throw new UnauthorizedAccessException(
                    "Credenciales inválidas");
            }

            if (user.State == EntityState.Inactivo)
            {
                _logger.LogWarning("Login failed: user '{Username}' is inactive", username);
                throw new UnauthorizedAccessException(
                    "El usuario está inactivo. Contacte al administrador");
            }

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                _logger.LogWarning("Login failed: wrong password for '{Username}'", username);
                throw new UnauthorizedAccessException(
                    "Credenciales inválidas");
            }

            _logger.LogInformation("User '{Username}' logged in successfully", username);
            return user;
        }

        public async Task<User> ChangePasswordAsync(
            int userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new KeyNotFoundException(
                    $"No se encontró el usuario con ID {userId}");

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                _logger.LogWarning(
                    "Password change failed: wrong current password for user {UserId}", userId);
                throw new InvalidOperationException(
                    "La contraseña actual es incorrecta");
            }

            if (newPassword.Length < 6)
                throw new InvalidOperationException(
                    "La nueva contraseña debe tener al menos 6 caracteres");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("Password changed for user {UserId}", userId);
            return user;
        }
    }
}