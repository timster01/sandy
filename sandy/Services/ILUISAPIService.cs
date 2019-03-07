using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using sandy.Models;

namespace sandy.Services
{
    public interface ILUISAPIService
    {
        Task<LUIS> QueryLUIS(string msg);  
    }
}
