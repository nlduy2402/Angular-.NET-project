using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Web_Server.DTOs.Account;
using Web_Server.Models;
using Web_Server.Services;
using System.Text;
using Web_Server.DTOs.Email;
using Microsoft.VisualBasic;

namespace Web_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly EmailService _emailService;
        private IConfiguration _config;
        public AccountController(JWTService jwtService, 
                                SignInManager<User>signInManager, 
                                UserManager<User> userManager, 
                                EmailService emailService,
                                IConfiguration configuration)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
            _config = configuration;
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
                //EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            try { 
                if(await SendConfirmEmailAsync(userToAdd))
                {
                    return Ok(new JsonResult(new { title = "Accout Created", message = "Your account has been created, Please CONFIRM your email !" }));
                }
                return BadRequest("Fail to send email. Please contact admin !");
            } 
            catch(Exception)
            {
                return BadRequest("Fail to send email. Please contact admin !");
            }
                
        }

        [HttpPut("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return Unauthorized("This email has not been registered yet !");
            }

            if(user.EmailConfirmed == true)
            {
                return BadRequest("Your email is already confirmed. You can login now !");
            }

            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var deocodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ConfirmEmailAsync(user, deocodedToken);
                if (result.Succeeded) return Ok(new JsonResult(new
                {
                    title = "Email Confirmed",
                    message = "Your email is confirmed. You can login now !"    
                }));
                return BadRequest("Invalid Token. Please try again !");
            }
            catch (Exception) {
                return BadRequest("Invalid Token. Please try again !");
            }
        }

        [HttpPost("resend-email-confirmation-link/{email}")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid Email !");
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized("This email has not been registered yet !");
            if (user.EmailConfirmed == true) {
                return BadRequest("Your email is already confirmed. You can login now !");
            }

            try
            {
                if(await SendConfirmEmailAsync(user))
                {
                    return Ok(new JsonResult(new { title = "Confirmation link sent !", message = "Please CONFIRM your email !" }));    
                }
                return BadRequest("Fail to resend. Please contact ADMIN !");
            }
            catch (Exception) {
                return BadRequest("Fail to resend. Please contact ADMIN !");
            }
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

        private async Task<bool> SendConfirmEmailAsync(User user) {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_config[("JWT:ClientUrl")]}/{_config["Email:ConfirmEmailPath"]}?token={token}&email={user.Email}";

            var body = $"<p>Hello: {user.FirstName} {user.LastName}</p>" + 
                "<p>Please confirm your email by clicking on the following link.</p>" +
                $"<p><a href=\"{url}\">Click here <3 </a></p>" +
                "<p>Thank You !</p>" +
                $"<br>{_config["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "Confirm your email", body);

            return await _emailService.SendEmailAsync(emailSend);
        }
        #endregion

    }
}
