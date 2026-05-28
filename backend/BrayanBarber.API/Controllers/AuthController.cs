using AutoMapper;
using BrayanBarber.API.DTOs.Request;
using BrayanBarber.API.DTOs.Response;
using BrayanBarber.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace BrayanBarber.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IMapper _mapper;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthService authService,
        IMapper mapper,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDTO>> Login(LoginRequestDTO dto)
    {
        try
        {
            var user = await _authService.LoginAsync(dto.Username, dto.Password);
            // Almacenar sesión en cookie de sesión simple
            HttpContext.Session.SetInt32("UserId", user.Id);
            HttpContext.Session.SetString("UserRole", user.Role.ToString());
            return Ok(_mapper.Map<AuthResponseDTO>(user));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    public ActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Sesión cerrada exitosamente" });
    }

    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword(ChangePasswordRequestDTO dto)
    {
        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId == null)
            return Unauthorized(new { message = "Debe iniciar sesión" });

        try
        {
            await _authService.ChangePasswordAsync(userId.Value, dto.CurrentPassword, dto.NewPassword);
            return Ok(new { message = "Contraseña actualizada exitosamente" });
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }
}