using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using sandy.Services;
using sandy.Models;
using System;
using System.Net.Http;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILUISAPIService LUISService;
        private readonly IEmailService emailService;

        private static Dictionary<string, Tuple<string, string>> questions = new Dictionary<string, Tuple<string, string>>();

        public ChatHub(ILUISAPIService LUISService, IEmailService emailService)
        {
            this.LUISService = LUISService;
            this.emailService = emailService;
        }

        public async Task SendMessage(string message)
        {
            string encodedMsg = HtmlEncoder.Default.Encode(message);

            if (!questions.ContainsKey(Context.ConnectionId))
            {
                LUIS LUISObj = await LUISService.QueryLUIS(encodedMsg);
                string topIntent = LUISObj.topScoringIntent.intent;
                if (topIntent == "Greetings")
                {
                    await Clients.Caller.SendAsync("ReceiveMessage", "Hallo!");
                }
                else
                {
                    questions.Add(Context.ConnectionId, new Tuple<string, string>(message, topIntent));
                    await Clients.Caller.SendAsync("ReceiveMessage", "Helaas weet ik (nog) geen antwoord op die vraag.. \nAls je nu je email stuurt nemen we persoonlijk contact met je op.");
                }
            }
            else
            {
                // should check if valid email, e.g. if it contains @ and .ext
                if (emailService.IsValidEmail(message))
                {
                    string question = questions[Context.ConnectionId].Item1;
                    string subject = questions[Context.ConnectionId].Item2;
                    questions.Remove(Context.ConnectionId);
                    await Clients.Caller.SendAsync("ReceiveMessage", "Bedankt! Er zal zo snel mogelijk contact met je worden opgenomen.");
                    await emailService.SendEmail(message, "Vraag van: " + message.Substring(0, message.IndexOf('@')) + ", over: " + subject, question);
                }
                else
                    await Clients.Caller.SendAsync("ReceiveMessage", "Vul alsjeblieft een correct email-adres in.");
            }
        }

        public async Task StartMessage()
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "Hoi, ik ben Sandy, de virtuele assistent van Search4Solutions. Wat is je vraag?");
        }
    }
}
