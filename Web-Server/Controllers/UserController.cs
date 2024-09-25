using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web_Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpGet("get-user")]
        public IActionResult GetUser()
        {
            return Ok(new JsonResult(new {
                message = "Only authorized user can do this action !" 
            }));
        }
    }
}
