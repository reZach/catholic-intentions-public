using CatholicIntentions.MaxMind;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatholicIntentions.Controllers
{
    [Route("")]
    [ServiceFilter(typeof(GDPRFilter))]
    public class UnavailableController : Controller
    {
        [Route("unavailable")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
