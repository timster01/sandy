using System.Net;
using System.Net.Mail;
using System.Web;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using sandy.Models;
using Microsoft.Extensions.Options;
using System;

namespace sandy.Services
{
    public class EmailService : IEmailService
    {
        private readonly IOptions<EmailConnectionStrings> emailConfig;
        private NetworkCredential credentials;
        public EmailService(IOptions<EmailConnectionStrings> emailConfig)
        {
            this.emailConfig = emailConfig;
        }
        public async Task SendEmail(string customerEmail, string subject, string message)
        {
            using (var client = new SmtpClient())
            {
                credentials = new NetworkCredential
                {
                    UserName = emailConfig.Value.SandyBotEmail,
                    Password = emailConfig.Value.Password
                };

                client.Credentials = credentials;
                client.Host = emailConfig.Value.Host;
                client.Port = int.Parse(emailConfig.Value.Port);
                client.EnableSsl = true;
                //client.Timeout = 5000;

                using (var emailMessage = new MailMessage())
                {
                    foreach (string adress in emailConfig.Value.ReceiverAdresses)
                        emailMessage.To.Add(new MailAddress(adress));
                    emailMessage.From = new MailAddress(emailConfig.Value.SandyBotEmail);
                    emailMessage.ReplyToList.Add(customerEmail);
                    emailMessage.Subject = subject;
                    emailMessage.Body = message;
                    client.Send(emailMessage);
                }
            }
            await Task.CompletedTask;
        }
        public bool IsValidEmail(string email)
        {
            try
            {
                var addr = new MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
