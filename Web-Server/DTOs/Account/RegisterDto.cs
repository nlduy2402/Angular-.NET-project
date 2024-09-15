using System.ComponentModel.DataAnnotations;

namespace Web_Server.DTOs.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(15, MinimumLength =3, ErrorMessage ="First name must be at least {2} and maximum {1} characters !")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(15, MinimumLength =3, ErrorMessage = "Last name must be at least {2} and maximum {1} characters !")]
        public string LastName { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage ="Invalid Email structure !")]
        public string Email { get; set; }
        [Required]
        [StringLength(15, MinimumLength = 6, ErrorMessage = "Password name must be at least {2} and maximum {1} characters !")]
        public string Password { get; set; }
    }
}
