using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sandy.Models
{
    public class EmailConnectionStrings
    {
        public string SandyBotEmail { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public string Port { get; set; }
        public string[] ReceiverAdresses { get; set; }
    }
}
