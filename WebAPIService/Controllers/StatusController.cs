using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using WebAPIService.Models;

namespace WebAPIService.Controllers
{
    public class StatusController : ApiController
    {
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        /// <summary>
        /// Получить список статусов
        /// </summary>
        /// <returns>список размеров и толщин пицц</returns>
        public List<MyStatus> GetStatuses()
        {
            using (PizzaDBEntities db = new PizzaDBEntities())
            {
                List<MyStatus> result = new List<MyStatus>();

                var statuses = db.Status.ToList();
                foreach (var s in statuses)
                    result.Add(new MyStatus(s.Id,s.Name));

                return result;
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        // POST api/values
        public HttpResponseMessage PostStatusUpdate([FromBody] int[] orders)
        {
            try
            {
                if (orders != null && orders.Length > 0)
                {
                    PizzaDBEntities db = new PizzaDBEntities();
                    List<StatOrder> result = new List<StatOrder>();
                    foreach (var ord in orders)
                    {
                        var order = db.Orders.SingleOrDefault(o => o.Id == ord && !o.IsCancelled);
                        if (order != null)
                        {
                            DateTime now = DateTime.Now;
                            int deltaMinuts = (int)Math.Floor((DateTime.Now - order.Date).TotalMinutes);
                            int newStat = (deltaMinuts >= 4) ? 5 : (deltaMinuts + 1);

                            order.StatusId = newStat;
                            db.SaveChanges();

                            result.Add(new StatOrder(ord, newStat));
                        }

                    }
                    return Request.CreateResponse(HttpStatusCode.OK, result);
                }
                var message = "Произошла ошибка. Мы уже занимаемся данным вопросом."; // пустой инпут
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.BadRequest, err);
            }
            catch (Exception e)
            {
                var message = "Произошла ошибка. Мы уже занимаемся данным вопросом."; // логирование пока не реализовано
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.BadRequest, err);
            }
        }
    }
}
