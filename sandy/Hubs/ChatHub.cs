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
using System.Threading;

namespace SignalRChat.Hubs
{
    public enum ChatState {
        waitForQuestion,
        waitForEmailConfirmation,
        waitForEmail,
        waitForQuestionConfirmation,
        waitForCheckColleague,
        done
    }
    public enum ReceivedMessage {
        Email,
        IncorrectMail,
        EmailConfirmation,
        QuestionConfirmation,
        UnknownQuestion,
        EmailDenial,
        ColleagueAvailable,
        ColleagueUnAvailable,
        done
    }
    public class Chat
    {       
        public string question;
        public string subject;
        public string email;
        public ChatState state = ChatState.waitForQuestion;
    }



    public class ChatHub : Hub
    {
        private readonly ILUISAPIService LUISService;
        private readonly IEmailService emailService;

        private static Dictionary<string, Chat> connectedChats = new Dictionary<string, Chat>();

        public ChatHub(ILUISAPIService LUISService, IEmailService emailService)
        {
            this.LUISService = LUISService;
            this.emailService = emailService;
        }

        public override async Task OnConnectedAsync() 
        {
            connectedChats[Context.ConnectionId] = new Chat();
            await Clients.Caller.SendAsync("ReceiveMessage", 
                "Hoi, ik ben Sandy, de virtuele assistent van Search4Solutions.");
            Thread.Sleep(1000);
            await Clients.Caller.SendAsync("ReceiveMessage", 
                "Wat is je vraag?");
        
        }
        public override Task OnDisconnectedAsync(Exception exception) 
        {
            connectedChats.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public ReceivedMessage handleChatStateAndData(string message, string topIntent, Chat chat) 
        {
            switch (chat.state) 
            {
                case ChatState.waitForEmailConfirmation:    // wil je een email-adres invullen?
                    if (topIntent == "Confirmation")
                        return ReceivedMessage.EmailConfirmation;
                    else 
                        return ReceivedMessage.EmailDenial;
                case ChatState.waitForEmail:
                    if (emailService.IsValidEmail(message)) {
                        chat.email = message;
                        return ReceivedMessage.Email;
                    }
                    else
                        return ReceivedMessage.IncorrectMail;
                case ChatState.waitForQuestionConfirmation: // heb je nog een vraag?
                    if (topIntent == "Confirmation")
                        return ReceivedMessage.QuestionConfirmation;
                    else
                        return ReceivedMessage.done;
                case ChatState.waitForCheckColleague:
                    if (topIntent == "Confirmation")
                        return ReceivedMessage.ColleagueAvailable;
                    else
                        return ReceivedMessage.ColleagueUnAvailable;
                case ChatState.done:
                    return ReceivedMessage.done;
                default:                                // wist het antwoord niet
                    chat.question = message;
                    chat.subject = topIntent;
                    return ReceivedMessage.UnknownQuestion;
            }
        }

        public string[] getResponse(ReceivedMessage rm) 
        {
            switch (rm) 
            {
                case ReceivedMessage.UnknownQuestion:
                    return new string[] {
                        "Helaas weet ik (nog) geen antwoord op die vraag..",
                        "Ik vraag het even na bij mijn collega of hij/zij kan helpen. Een half minuutje geduld alsjeblieft.",
                    };
                case ReceivedMessage.EmailConfirmation:
                    return new string[] {
                        "Vul alsjeblieft je emailadres in."
                    };
                case ReceivedMessage.EmailDenial:
                    return new string[] {
                        "Heb je nog een andere vraag?"
                    };
                case ReceivedMessage.IncorrectMail:
                    return new string[] {
                        "Dit is geen correct emailadres. Wil je nog steeds je emailadres invullen?"
                    };
                case ReceivedMessage.Email:
                    return new string[] {
                        "Bedankt! Er zal zo snel mogelijk contact met je worden opgenomen."
                    };
                case ReceivedMessage.QuestionConfirmation:
                    return new string[] {
                        "Wat wil je nog meer weten?"
                    };
                case ReceivedMessage.ColleagueAvailable:
                    return new string[] {
                        "We verbinden je nu door!"
                    };
                case ReceivedMessage.ColleagueUnAvailable:
                    return new string[] {
                        @"sorry ik kan op het moment niemand bereiken. 
                        Als je je emailadres aan me geeft dan nemen we persoonlijk contact met je op.. 
                        Ik beloof plechtig dat we het niet voor spam zullen gebruiken :-)",
                        "Wil je een email adres opgeven?"
                    };
                case ReceivedMessage.done:
                    return new string[] {
                        "Oke, tot ziens!"
                    };
                default: 
                    return new string [] {};
            }
        }

        public async Task handleTasksAndSetNewState(ReceivedMessage rm, Chat chat) {
            switch (rm) 
            {
                case ReceivedMessage.UnknownQuestion:
                    chat.state = ChatState.waitForCheckColleague;

                    // send hier iets dat checkt of er een collega beschikbaar is
                    Thread.Sleep(3000); // simuleert nu eventjes de check tijd
                    await SendMessage("Nee"); // geen colleague available

                    break;
                case ReceivedMessage.ColleagueUnAvailable:
                    chat.state = ChatState.waitForEmailConfirmation;
                    break;
                case ReceivedMessage.ColleagueAvailable:
                    chat.state = ChatState.waitForEmailConfirmation;
                    break;
                case ReceivedMessage.EmailConfirmation:
                    chat.state = ChatState.waitForEmail;
                    break;
                case ReceivedMessage.EmailDenial:
                    chat.state = ChatState.waitForQuestionConfirmation;
                    break;
                case ReceivedMessage.IncorrectMail:       
                    chat.state = ChatState.waitForEmailConfirmation;
                    break;
                case ReceivedMessage.Email:
                    chat.state = ChatState.done;
                    emailService.SendEmail(chat.email, "Vraag van: " + chat.email.Substring(0, chat.email.IndexOf('@')) + ", over: " + chat.subject, chat.question);
                    break;
                case ReceivedMessage.QuestionConfirmation:
                    chat.state = ChatState.waitForQuestion;
                    break;
                case ReceivedMessage.done:
                    chat.state = ChatState.done;
                    break;
            }
        }

        public async Task SendMessage(string message)
        {
            string encodedMsg = HtmlEncoder.Default.Encode(message);

            LUIS LUISObj = await LUISService.QueryLUIS(encodedMsg);
            string topIntent = LUISObj.topScoringIntent.intent;
            Chat chat = connectedChats[Context.ConnectionId];

            if (chat.state == ChatState.waitForQuestion)
            {
                switch (topIntent) 
                {
                    case "Greetings":
                        await Clients.Caller.SendAsync("ReceiveMessage", "Hallo!");
                        return;
                    case "GetInfoAboutContiniousDelivery":
                        await Clients.Caller.SendAsync("ReceiveMessage", "Continious Delivery... info info info... ");
                        return;
                }   
            }
            
            // sandy wist geen antwoord, via LUIS

            // verwerkt het inkomend bericht, en geeft een status terug
            ReceivedMessage rState = handleChatStateAndData(message, topIntent, chat);

            // get response, misschien wel uit een database..
            string[] response = getResponse(rState);

            // reply
            for (int i = 0; i < response.Length; i++)
                await Clients.Caller.SendAsync("ReceiveMessage", response[i]);  
                  
            // voert eventuele tasks uit die nodig zijn aan de hand van de status van het ontvangen bericht
            await handleTasksAndSetNewState(rState, chat);
        }
    }
}
