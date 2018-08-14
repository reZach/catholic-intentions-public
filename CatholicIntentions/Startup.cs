using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CatholicIntentions.MaxMind;
using CatholicIntentions.Rewrite;
using MaxMind.Db;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;

namespace CatholicIntentions
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        //public RewriteOptions RewriteOptions { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            services.AddSingleton<IMaxMindService, MaxMindService>();
            services.AddScoped<GDPRFilter>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // add redirects
                app.UseRewriter(new RewriteOptions()
                    .Add(new RedirectRules()));
            }
            else
            {
                // add redirects
                app.UseRewriter(new RewriteOptions()
                    .Add(new CanonicalDomainRewriteRule())
                    .Add(new RedirectRules()));
            }                        

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                ForwardedHeaders.XForwardedProto
            });

            app.Use(async (context, next) =>
            {
                // Recommendations from: https://www.dareboost.com

                // Content Security Policy; to prevent XSS
                context.Response.Headers.Add(
                    "Content-Security-Policy",
                    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com *.firebaseio.com *.facebook.net *.facebook.com *.twitter.com; " +
                    "style-src 'self' 'unsafe-inline'; " +
                    "img-src 'self' http://www.googletagmanager.com https://www.google-analytics.com *.facebook.com *.fbcdn.net; " +
                    "base-uri 'self';");

                // Prevent loading the page if XSS is injected
                context.Response.Headers.Add(
                    "X-XSS-Protection",
                    "1; mode=block");

                // Prevent clickjacking
                context.Response.Headers.Add(
                    "X-Frame-Options",
                    "Deny");

                // Prevent MIME-sniffing / exploits
                context.Response.Headers.Add(
                    "X-Content-Type-Options",
                    "nosniff");

                // Disable Azure server affinity cookie;
                // because it is a http-only cookie;
                // https://github.com/Azure/app-service-announcements/issues/12
                context.Response.Headers.Add(
                    "Arr-Disable-Session-Affinity",
                    "True");

                await next();
            });

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    const int durationInSeconds = 60 * 60 * 24 * 7;
                    ctx.Context.Response.Headers[HeaderNames.CacheControl] = "public,max-age=" + durationInSeconds;
                }
            });

            app.UseStatusCodePagesWithReExecute("/Error/{0}");

            app.UseMvc();
        }
    }
}
