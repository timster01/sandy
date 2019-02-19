using Microsoft.AspNetCore.SignalR;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string message)
        {
            string encodedMsg = HtmlEncoder.Default.Encode(message);

            if (message == "request start message")
            {
                await Clients.Caller.SendAsync("ReceiveMessage", "Hoi, ik ben Sandy, de virtuele assistent van Search4Solutions. Waarmee kan ik je helpen?");
            }
            else
                await Clients.Caller.SendAsync("ReceiveMessage", "Hoi, dit is een response message van de server op je bericht: " + encodedMsg);
        }
    }
}
