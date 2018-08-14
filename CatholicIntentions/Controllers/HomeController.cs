using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using CatholicIntentions.MaxMind;
using MaxMind.Db;
using Microsoft.AspNetCore.Mvc;

namespace CatholicIntentions.Controllers
{
    [Route("")]
    [ServiceFilter(typeof(GDPRFilter))]
    public class HomeController : Controller
    {
        private readonly IMaxMindService _iMaxMindService;

        public HomeController(IMaxMindService iMaxMindService)
        {
            _iMaxMindService = iMaxMindService;
        }

        [Route("")]
        [Route("home")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
