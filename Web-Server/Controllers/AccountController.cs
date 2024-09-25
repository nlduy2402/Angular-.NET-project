using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using Web_Server.DTOs.Account;
using Web_Server.Models;
using Web_Server.Services;

namespace Web_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        public AccountController(JWTService jwtService, SignInManager<User>signInManager, UserManager<User> userManager) {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpGet("refresh-token")]
        [Authorize]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDTO(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null) { 
                return Unauthorized("Invalid Username or Password !");
            }

            if (user.EmailConfirmed == false) return Unauthorized("Please confirm your Email !");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if(!result.Succeeded) {
                return Unauthorized("Invalid Username or Password !");
            }

            return CreateApplicationUserDTO(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if(await CheckEmailExistAsynnc(model.Email))
            {
                return BadRequest($"An existing account is using email {model.Email}. Please use another email !");
            }

            var userToAdd = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.Email.ToLower(),
                Email = model.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);
            return Ok(new JsonResult(new {title="Accout Created", message ="Your account has been created, Login now !"}));     
        }

        #region Private Helper Methods
        private UserDto CreateApplicationUserDTO(User user) {
            return new UserDto {
                FirstName = user.FirstName,
                LastName = user.LastName,
                JWT = _jwtService.createJWT(user)
            };
        }

        private async Task<bool> CheckEmailExistAsynnc(string email)
        {
            return await _userManager.Users.AnyAsync(x  => x.Email == email.ToLower());
        }
        #endregion

    }
}
