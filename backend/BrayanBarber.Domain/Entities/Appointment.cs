using BrayanBarber.Domain.Enums;

namespace BrayanBarber.Domain.Entities
{
    public class Appointment : AuditBase
    {
        public DateTime Date { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pendiente;
        public string? Notes { get; set; }

        // Foreign Keys
        public int ClientId { get; set; }
        public int BarberId { get; set; }

        // Navigation Properties
        public Client Client { get; set; } = null!;
        public Barber Barber { get; set; } = null!;
    }
}