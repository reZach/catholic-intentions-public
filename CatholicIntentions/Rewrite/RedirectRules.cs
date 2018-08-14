using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatholicIntentions.Rewrite
{
    public class RedirectRules : IRule
    {
        public void ApplyRule(RewriteContext context)
        {
            HttpRequest request = context.HttpContext.Request;

            if (request.Path.HasValue)
            {
                if (request.Path.Value.Equals("/about"))
                {
                    RedirectLogic(context, "/about-us");
                }
                else if (request.Path.Value.Equals("/prayers"))
                {
                    RedirectLogic(context, "/prayer-requests");
                }
                else if (request.Path.Value.Equals("/submit"))
                {
                    RedirectLogic(context, "/submit-prayer-request");
                }
                else if (request.Path.Value.Equals("/privacy"))
                {
                    RedirectLogic(context, "/privacy-policy");
                }
                else if (request.Path.Value.Equals("/terms"))
                {
                    RedirectLogic(context, "/terms-of-use");
                }
            }
        }

        private void RedirectLogic(RewriteContext rewriteContext, string redirectTo)
        {
            var response = rewriteContext.HttpContext.Response;
            response.StatusCode = StatusCodes.Status301MovedPermanently;
            rewriteContext.Result = RuleResult.EndResponse;
            response.Headers[HeaderNames.Location] = redirectTo;
        }
    }
}
