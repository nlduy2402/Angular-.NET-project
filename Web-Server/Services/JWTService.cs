using Microsoft.Extensions.Configuration;
using Web_Server.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Collections.Generic;
using System.Security.Claims;
using System;
using System.IdentityModel.Tokens.Jwt;
namespace Web_Server.Services
{
    public class JWTService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _jwtKey;
        public JWTService(IConfiguration configuration) {
            _configuration = configuration;
            _jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
        }
        public string createJWT(User user)
        {
            var userClaims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
            };

            var credential = new SigningCredentials(_jwtKey, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(userClaims),
                Expires = DateTime.UtcNow.AddDays(Int32.Parse(_configuration["JWT:ExpiresInDays"])),
                SigningCredentials = credential,
                Issuer = _configuration["JWT:Issuer"]
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwt = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(jwt);
        }
    }
}
