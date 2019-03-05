using System.Threading.Tasks;

namespace sandy.Services
{
    public interface IEmailService
    {
        Task SendEmail(string email, string subject, string message);
    }
}
