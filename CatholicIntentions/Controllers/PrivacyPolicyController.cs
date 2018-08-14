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
    public class PrivacyPolicyController : Controller
    {
        [Route("privacy-policy")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("privacy-policy/facebook")]
        public IActionResult Facebook()
        {
            return View();
        }
    }
}