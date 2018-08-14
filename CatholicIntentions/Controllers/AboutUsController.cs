using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CatholicIntentions.MaxMind;
using Microsoft.AspNetCore.Mvc;

namespace CatholicIntentions.Controllers
{
    [Route("")]
    [ServiceFilter(typeof(GDPRFilter))]
    public class AboutUsController : Controller
    {
        [Route("about-us")]
        public IActionResult Index()
        {
            return View();
        }
    }
}