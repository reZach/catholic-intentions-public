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
    public class CatholicController : Controller
    {
        [Route("catholic")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("catholic/prayers")]
        public IActionResult Prayers()
        {
            return View();
        }

        [Route("catholic/prayers/hail-mary")]
        public IActionResult HailMary()
        {
            return View();
        }

        [Route("catholic/prayers/our-father")]
        public IActionResult OurFather()
        {
            return View();
        }

        [Route("catholic/prayers/glory-be")]
        public IActionResult GloryBe()
        {
            return View();
        }
    }
}