using BrayanBarber.Domain.Enums;

namespace BrayanBarber.Domain.Entities
{
    public class User : AuditBase
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public EntityState State { get; set; } = EntityState.Activo;
    }
}