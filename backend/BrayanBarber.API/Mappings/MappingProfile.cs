using AutoMapper;
using BrayanBarber.API.DTOs.Request;
using BrayanBarber.API.DTOs.Response;
using BrayanBarber.Domain.Entities;

namespace BrayanBarber.API.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Auth
            CreateMap<User, AuthResponseDTO>()
                .ForMember(dest => dest.Role,
                    opt => opt.MapFrom(src => src.Role.ToString()))
                .ForMember(dest => dest.FullName,
                    opt => opt.MapFrom(src => ResolveFullName(src)));

        }

        /// Método estático separado para resolver FullName según el tipo concreto.
        private static string ResolveFullName(User user)
        {
            if (user is Admin admin)
                return admin.FullName;

            if (user is Barber barber)
                return barber.FullName;

            return user.Username;
        }
    }
}