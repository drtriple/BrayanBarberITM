using BrayanBarber.DataAccess.Context;
using BrayanBarber.Domain.Entities;
using BrayanBarber.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace BrayanBarber.DataAccess.Seeders
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(BarberDbContext context)
        {
            // Solo crea el admin si no existe ningún usuario
            if (await context.Users.AnyAsync())
                return;

            var admin = new Admin
            {
                Username = "brayan",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Administrador,
                State = Domain.Enums.EntityState.Activo,
                Document = "1000000000",
                FullName = "Brayan Administrador",
                Phone = "3000000000",
                CreatedAt = DateTime.UtcNow
            };

            context.Admins.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}