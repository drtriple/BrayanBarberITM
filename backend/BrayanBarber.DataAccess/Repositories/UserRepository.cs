using BrayanBarber.DataAccess.Context;
using BrayanBarber.Domain.Entities;
using BrayanBarber.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BrayanBarber.DataAccess.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(BarberDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _dbSet
                .Where(u => u.Username.ToLower() == username.ToLower())
                .FirstOrDefaultAsync();
        }

        public async Task<bool> ExistsByUsernameAsync(string username)
        {
            return await _dbSet
                .AnyAsync(u => u.Username.ToLower() == username.ToLower());
        }
    }
}