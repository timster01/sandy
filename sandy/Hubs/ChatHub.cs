using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using sandy_iframe.Models;
using System;
using System.Net.Http;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IOptions<LUISConnectionStrings> LUISConfig;

        public ChatHub(IOptions<LUISConnectionStrings> LUISConfig)
        {
            this.LUISConfig = LUISConfig;
        }


        public async Task SendMessage(string message)
        {
            string encodedMsg = HtmlEncoder.Default.Encode(message);


            if (message == "request start message")
            {
                await Clients.Caller.SendAsync("ReceiveMessage", "Hoi, ik ben Sandy, de virtuele assistent van Search4Solutions. Waarmee kan ik je helpen?");
            }
            else
            {
                LUIS LUISResultObj = await QueryLUIS(encodedMsg);

                await Clients.Caller.SendAsync("ReceiveMessage", "Hoi, dit is een response message van de server op je bericht: " + encodedMsg);
                await Clients.Caller.SendAsync("ReceiveMessage", "Geschatte intent: " + LUISResultObj.topScoringIntent.intent);
            }
        }

        private async Task<LUIS> QueryLUIS(string msg)
        {
            LUIS LUISResult = new LUIS();

            var LUISQuery = Uri.EscapeDataString(msg);
            using (HttpClient client = new HttpClient())
            {
                string LUIS_Url = LUISConfig.Value.Url;
                string LUIS_Subscription_Key = LUISConfig.Value.Key;

                string requestURI = String.Format("{0}&subscription-key={1}&q={2}",
                    LUIS_Url, LUIS_Subscription_Key, LUISQuery);
                HttpResponseMessage httpMsg = await client.GetAsync(requestURI);
                if (httpMsg.IsSuccessStatusCode)
                {
                    var JsonDataResponse = await httpMsg.Content.ReadAsStringAsync();
                    LUISResult = JsonConvert.DeserializeObject<LUIS>(JsonDataResponse);
                }
                LUISResult.query = requestURI;
            }
            return LUISResult;
        }
    }
}
