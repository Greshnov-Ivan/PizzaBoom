using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIService.Models
{
    public class Checks
    {
        /// <summary>
        /// краткая проверка, на полноценную не хватило времени и сил((
        /// так как наиболее важна сумма, её и проверим
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns>
        public Boolean checkPrice(OrderIn order)
        {
            decimal allPrice = 0;
            using (PizzaDBEntities db = new PizzaDBEntities())
            {
                foreach (var pizza in order.PizzasOrder)
                {
                    var price = db.PizzaCombinations
                        .Where(c => c.PizzaId == pizza.PizzaId && c.SizeId == pizza.SizeId && c.DoughId == pizza.DoughId)
                        .FirstOrDefault().Price;
                    if (pizza.FreeIngredients != null && pizza.FreeIngredients.Count > 0)
                        foreach (var freeIn in pizza.FreeIngredients)
                            price += db.Ingredients.Where(i => i.Id == freeIn).FirstOrDefault().Price ?? 0;
                    if (price != pizza.Price)
                    {
                        return false;
                    }
                    else
                        allPrice += price;
                }
                if (allPrice != order.AllPrice)
                    return false;
                else
                    return true;
            }
        }
    }
}