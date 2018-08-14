using MaxMind.Db;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CatholicIntentions.MaxMind
{
    public class MaxMindService : IMaxMindService, IDisposable
    {
        private Reader Reader { get; set; }

        private Reader GetReference()
        {
            if (Reader == null)
            {
                Reader = new Reader("MaxMind/GeoLite2-Country.mmdb");
            }            

            return Reader;
        }

        public Dictionary<string, object> GetData(string IP)
        {
            return GetReference().Find<Dictionary<string, object>>(IPAddress.Parse(IP));
        }

        public void Dispose()
        {
            if (GetReference() != null)
            {
                Reader.Dispose();
            }
        }
    }

    public interface IMaxMindService
    {
        Dictionary<string, object> GetData(string IP);
    }
}
