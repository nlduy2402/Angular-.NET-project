using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using System.Threading.Tasks;
using Web_Server.DTOs.Email;
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;

namespace Web_Server.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration configuration)
        {
            _config = configuration;
        }

        public async Task<bool> SendEmailAsync(EmailSendDto model)
        {
            MailjetClient client = new MailjetClient(_config["MailJet:ApiKey"], _config["MailJet:SecrectKey"]);

            var email = new TransactionalEmailBuilder()
                .WithFrom(new SendContact(_config["Email:From"], _config["Email:ApplicationName"]))
                .WithSubject(model.Subject)
                .WithHtmlPart(model.Body)
                .WithTo(new SendContact(model.To))
                .Build();

            var response = await client.SendTransactionalEmailAsync(email);

            if (response.Messages != null)
            {
                if (response.Messages[0].Status == "success")
                {
                    return true; 
                }
            }
            return false;
        }

    }
}
