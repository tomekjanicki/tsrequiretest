using System.Web.Http;
using WebApplication3.Models;

namespace WebApplication3.Controllers
{
    public class TestController : ApiController
    {
        public string Get([FromUri]Dto dto)
        {
            return dto != null ? $"{dto.Id} {dto.Category}" : string.Empty;
        }
    }
}
