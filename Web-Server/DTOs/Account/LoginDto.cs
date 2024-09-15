using System.ComponentModel.DataAnnotations;

namespace Web_Server.DTOs.Account
{
    public class LoginDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
