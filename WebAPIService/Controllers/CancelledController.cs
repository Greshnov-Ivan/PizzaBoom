using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebAPIService.Controllers
{
    public class CancelledController : ApiController
    {

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        // POST api/values
        public HttpResponseMessage PostOrderCancelled([FromBody] int id)
        {
            try
            {
                PizzaDBEntities db = new PizzaDBEntities();

                var order = db.Orders.Where(o => o.Id == id).FirstOrDefault(); 

                #region 
                // Так как статусы в БД не обновляются, а мы имитируем эту работу сами,
                // то запустим проверку
                DateTime now = DateTime.Now;
                int deltaMinuts = (int)Math.Floor((DateTime.Now - order.Date).TotalMinutes);
                int newStat = (deltaMinuts >= 4) ? 5 : (deltaMinuts + 1);
                order.StatusId = newStat;
                #endregion

                if (order.StatusId < 5)
                {
                    order.IsCancelled = true;

                    db.SaveChanges();

                    return Request.CreateResponse(HttpStatusCode.OK, true);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }

            }
            catch (Exception e)
            {
                var message = "Произошла ошибка. Попробуйте ещё раз."; // логирование пока не реализовано
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.BadRequest, err);
            }
        }
    }
}
