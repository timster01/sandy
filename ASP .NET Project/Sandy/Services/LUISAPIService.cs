using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using sandy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace sandy.Services
{
    public class LUISAPIService : ILUISAPIService
    {
        private readonly IOptions<LUISConnectionStrings> LUISConfig;
        public LUISAPIService(IOptions<LUISConnectionStrings> LUISConfig)
        {
            this.LUISConfig = LUISConfig;
        }
        public async Task<LUIS> QueryLUIS(string msg)
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
