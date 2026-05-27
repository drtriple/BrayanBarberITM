using BrayanBarber.Domain.Enums;

namespace BrayanBarber.Domain.Entities
{
    public class Client : AuditBase
    {
        public string Document { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public EntityState State { get; set; } = EntityState.Activo;

        // Navigation Properties
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}