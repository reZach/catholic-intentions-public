using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatholicIntentions.Rewrite
{
    // https://stackoverflow.com/a/48673147/1837080
    public class CanonicalDomainRewriteRule : IRule
    {
        public void ApplyRule(RewriteContext context)
        {
            HttpRequest request = context.HttpContext.Request;

            if (request.Host.Value.Contains("localhost") || 
                request.Host.Value.Contains("azurewebsites") ||
                request.Host.Value.StartsWith("www.", StringComparison.OrdinalIgnoreCase) &&
                request.Host.Value.Contains("catholicintentions.com"))
            {
                return;
            }
            else
            {
                HttpResponse response = context.HttpContext.Response;

                string redirectUrl = $"{request.Scheme}://www.{request.Host}{request.Path}{request.QueryString}";
                response.Headers[HeaderNames.Location] = redirectUrl;
                response.StatusCode = StatusCodes.Status301MovedPermanently;
                context.Result = RuleResult.EndResponse;
            }
        }
    }
}
