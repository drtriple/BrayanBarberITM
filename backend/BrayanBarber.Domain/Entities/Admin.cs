namespace BrayanBarber.Domain.Entities
{
    public class Admin : User
    {
        public string Document { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}