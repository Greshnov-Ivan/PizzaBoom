using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using System.Web.Http.Cors;
using WebAPIService.Models;

namespace WebAPIService.Controllers
{
    public class OrdersController : ApiController
    {

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        // POST api/values
        public HttpResponseMessage PostOrder([FromBody] OrderIn order)
        {
            var check = new Checks();
            if (!check.checkPrice(order))
            {
                //Про несоответствие цены клиенту знать не обязательно
                var message = "Произошла ошибка. Попробуйте очистить корзину.";
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.BadRequest, err);
            }
            else
            {
                try
                {
                    PizzaDBEntities db = new PizzaDBEntities();
                    Orders newOrder = new Orders
                    {
                        Date = DateTime.Now,
                        Price = order.AllPrice,
                        Phone = order.Phone,
                        StatusId = 1
                    };
                   
                    db.Orders.Add(newOrder);
                    db.SaveChanges();
                    var orderId = newOrder.Id;

                    foreach (var pizza in order.PizzasOrder)
                    {
                        if (pizza.FreeIngredients == null || pizza.FreeIngredients.Count == 0)
                        {
                            DetailsOrders newDetailOrder = new DetailsOrders 
                            {
                                DoughId = pizza.DoughId,
                                FreeIngredientId = null,
                                OrderId = orderId,
                                PizzaId = pizza.PizzaId,
                                SizeId = pizza.SizeId
                            };
                            
                            db.DetailsOrders.Add(newDetailOrder);
                        }
                        else
                            foreach (var freeIng in pizza.FreeIngredients)
                            {
                                DetailsOrders newDetailOrder = new DetailsOrders
                                {
                                    DoughId = pizza.DoughId,
                                    FreeIngredientId = freeIng,
                                    OrderId = orderId,
                                    PizzaId = pizza.PizzaId,
                                    SizeId = pizza.SizeId,
                                };

                                db.DetailsOrders.Add(newDetailOrder);
                            }

                        db.SaveChanges();
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, orderId);
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
}
