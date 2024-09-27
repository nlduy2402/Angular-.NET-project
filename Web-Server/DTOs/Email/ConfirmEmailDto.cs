using System.ComponentModel.DataAnnotations;

namespace Web_Server.DTOs.Email
{
    public class ConfirmEmailDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid Email structure !")]
        public string Email { get; set; }
    }
}
