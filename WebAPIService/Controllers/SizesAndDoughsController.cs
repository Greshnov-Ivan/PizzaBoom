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
    public class SizesAndDoughsController : ApiController
    {
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        /// <summary>
        /// Получить список размеров и толщин пицц
        /// </summary>
        /// <returns>список размеров и толщин пицц</returns>
        public SizesAndDoughs GetFreeIngredients()
        {
            using (PizzaDBEntities db = new PizzaDBEntities())
            {
                SizesAndDoughs result = new SizesAndDoughs();

                //Получим список размеров отсортированный по диаметру
                var sizes = db.Sizes.OrderBy(s => s.Diameter).ToList();
                foreach (var size in sizes)
                    result.Sizes.Add(new Size(size.Id, size.Name, size.Diameter));
                //Получим список толщин отсортированный по Id
                var doughs = db.Doughs.OrderBy(s => s.Id).ToList();
                foreach (var dough in doughs)
                    result.Doughs.Add(new Dough(dough.Id, dough.Name));

                return result;
            }
        }
    }
}
