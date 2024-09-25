using System.ComponentModel.DataAnnotations;

namespace Web_Server.DTOs.Account
{
    public class LoginDto
    {
        [Required(ErrorMessage ="Username is Required !")]
        public string UserName { get; set; }
        [Required(ErrorMessage ="Password is Required !")]
        public string Password { get; set; }
    }
}
