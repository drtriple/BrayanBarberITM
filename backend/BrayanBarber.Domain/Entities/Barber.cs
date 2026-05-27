namespace BrayanBarber.Domain.Entities
{
    public class Barber : User
    {
        public string Document { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        // Navigation Properties
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}