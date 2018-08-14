using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using CatholicIntentions.Controllers;

namespace CatholicIntentions.MaxMind
{
    // https://stackoverflow.com/q/36109052/1837080
    public class GDPRFilter : ActionFilterAttribute
    {
        private readonly IMaxMindService _iMaxMindService;

        public GDPRFilter()
        {
        }

        public GDPRFilter(IMaxMindService iMaxMindService)
        {
            _iMaxMindService = iMaxMindService;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            IPAddress clientIP = context.HttpContext.Connection.RemoteIpAddress;

            // Localhost woes
            if (clientIP.ToString() == "::1" ||
                clientIP.ToString() == "127.0.0.1")
            {
                (context.Controller as Controller).ViewBag.isEU = "False";
            }
            else
            {
                Dictionary<string, object> raw = _iMaxMindService.GetData(clientIP.ToString());
                var continentData = (raw["continent"]);
                var json = JsonConvert.SerializeObject(continentData);
                var dictionary = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

                if (dictionary["code"].ToString() == "EU")
                {
                    (context.Controller as Controller).ViewBag.isEU = "True";
                    if (!(context.Controller is UnavailableController))
                    {                        
                        context.Result = new RedirectToActionResult("Index", "Unavailable", null);
                    }                    
                }
                else
                {
                    (context.Controller as Controller).ViewBag.isEU = "False";
                }
            }            
        }
    }

    public struct MaxMindResponse
    {
        public string geoname_id;
        public string iso_code;
    }
}
