using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sandy.Models
{
    public class Intent
    {
        public string intent { get; set; }
        public double score { get; set; }
    }

    public class LUIS
    {
        public string query { get; set; }
        public Intent topScoringIntent { get; set; }
        public IList<Intent> intents { get; set; }
        public IList<object> entities { get; set; }
    }

    public class LUISConnectionStrings
    {
        public string Url { get; set; }
        public string Key { get; set; }
    }
}
