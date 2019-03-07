
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using sandy.Models;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace myapp.Controllers
{

    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

