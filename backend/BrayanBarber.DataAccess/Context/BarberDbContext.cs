using BrayanBarber.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BrayanBarber.DataAccess.Context
{
    public class BarberDbContext : DbContext
    {
        public BarberDbContext(DbContextOptions<BarberDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Admin> Admins => Set<Admin>();
        public DbSet<Barber> Barbers => Set<Barber>();
        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Appointment> Appointments => Set<Appointment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── TPH Inheritance: User, Admin, Barber en una sola tabla ──
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Username).IsRequired().HasMaxLength(80);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Role).IsRequired();
                entity.Property(u => u.State).IsRequired();
                entity.Property(u => u.CreatedAt).IsRequired();
                entity.Property(u => u.UpdatedAt).IsRequired(false);
                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasDiscriminator<string>("UserType")
                      .HasValue<User>("User")
                      .HasValue<Admin>("Admin")
                      .HasValue<Barber>("Barber");
            });

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.Property(a => a.Document).IsRequired().HasMaxLength(20);
                entity.Property(a => a.FullName).IsRequired().HasMaxLength(150);
                entity.Property(a => a.Phone).HasMaxLength(20);
            });

            modelBuilder.Entity<Barber>(entity =>
            {
                entity.Property(b => b.Document).IsRequired().HasMaxLength(20);
                entity.Property(b => b.FullName).IsRequired().HasMaxLength(150);
                entity.Property(b => b.Phone).HasMaxLength(20);
                entity.Property(b => b.Address).HasMaxLength(200);
            });

            // ── Client Configuration ──
            modelBuilder.Entity<Client>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Document).IsRequired().HasMaxLength(20);
                entity.Property(c => c.FullName).IsRequired().HasMaxLength(150);
                entity.Property(c => c.Phone).HasMaxLength(20);
                entity.Property(c => c.State).IsRequired();
                entity.Property(c => c.CreatedAt).IsRequired();
                entity.Property(c => c.UpdatedAt).IsRequired(false);
                entity.HasIndex(c => c.Document).IsUnique();
            });

            // ── Appointment Configuration ──
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Date).IsRequired();
                entity.Property(a => a.Status).IsRequired();
                entity.Property(a => a.Notes).HasMaxLength(500).IsRequired(false);
                entity.Property(a => a.CreatedAt).IsRequired();
                entity.Property(a => a.UpdatedAt).IsRequired(false);

                // Relación con Client
                entity.HasOne(a => a.Client)
                      .WithMany(c => c.Appointments)
                      .HasForeignKey(a => a.ClientId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relación con Barber
                entity.HasOne(a => a.Barber)
                      .WithMany(b => b.Appointments)
                      .HasForeignKey(a => a.BarberId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Índice único: barbero no puede tener dos citas a la misma hora
                entity.HasIndex(a => new { a.BarberId, a.Date }).IsUnique();
            });
        }
    }
}