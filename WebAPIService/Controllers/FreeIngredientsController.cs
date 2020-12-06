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
    public class FreeIngredientsController : ApiController
    {
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        /// <summary>
        /// Получить список "свободных" ингредиентов из таблицы Ingredients
        /// </summary>
        /// <returns>список "свободных" ингредиентов</returns>
        public IEnumerable<FreeIngredient> GetFreeIngredients()
        {
            using (PizzaDBEntities db = new PizzaDBEntities())
            {
                List<FreeIngredient> result = new List<FreeIngredient>();

                //Получим "свободные" ингредиенты из таблицы
                var freeIngredients = db.Ingredients.Where(i => i.Free);
                foreach (var freeIng in freeIngredients)
                {
                    //Запишем их в наш список в виде объекта описанного нами класса
                    result.Add(new FreeIngredient(freeIng.Id, freeIng.Name, freeIng.Weight??0, freeIng.Price??0));
                }

                return result;
            }
        }
    }
}
