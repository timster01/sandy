using Microsoft.AspNetCore.SignalR;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string message)
        {
            message = HtmlEncoder.Default.Encode(message);
            await Clients.Caller.SendAsync("ReceiveMessage", "Hoi, dit is een response message van de server op je bericht: " + message);
        }
    }
}
