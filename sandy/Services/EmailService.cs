using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using sandy.Models;
using Microsoft.Extensions.Options;

namespace sandy.Services
{
    public class EmailService : IEmailService
    {
        private readonly IOptions<EmailConnectionStrings> emailConfig;
        public EmailService(IOptions<EmailConnectionStrings> emailConfig)
        {
            this.emailConfig = emailConfig;
        }
        public async Task SendEmail(string email, string subject, string message)
        {
            using (var client = new SmtpClient())
            {
                var credential = new NetworkCredential
                {
                    UserName = emailConfig.Value.Email,
                    Password = emailConfig.Value.Password
                };

                client.Credentials = credential;
                client.Host = emailConfig.Value.Host;
                client.Port = int.Parse(emailConfig.Value.Port);
                client.EnableSsl = true;

                using (var emailMessage = new MailMessage())
                {
                    emailMessage.To.Add(new MailAddress(email));
                    emailMessage.From = new MailAddress("test@test.nl");
                    //emailMessage.ReplyTo = new MailAddress("test@test.nl");
                    emailMessage.ReplyToList.Add("test@test.nl");
                    emailMessage.Subject = subject;
                    emailMessage.Body = message;
                    client.Send(emailMessage);
                }
            }
            await Task.CompletedTask;
        }
    }
}
