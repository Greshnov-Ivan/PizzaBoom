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
    public class PizzasAllInfoController : ApiController
    {
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        /// <summary>
        /// Получить список пицц с полной информацией по каждой
        /// </summary>
        /// <returns>список объектов содержащих пиццы и полную необходимую информацию связанную с каждой из них - объекты описанного нами класса</returns>
        public IEnumerable<PizzaAllInfo> GetPizzasAllInfos()
        {
            using (PizzaDBEntities db = new PizzaDBEntities())
            {
                List<PizzaAllInfo> result = new List<PizzaAllInfo>();
                
                //Получим список пицц отсортированный по названию
                var pizzas = db.Pizzas.OrderBy(p => p.Name);
                foreach (var pizza in pizzas)
                {
                    //Создадим объект текущей пиццы нашего класса
                    var pizzaAllInfo = new PizzaAllInfo(pizza.Id,pizza.Name);
                    //Далее необходимо собрать связанную информацию и дополнить объект

                    //Пробежимся по строчкам таблицы, в которых указаны ссылки на используемые ингредиенты
                    foreach (var pizzaIngr in pizza.PizzaIngredients)
                    {
                        //Добавим каждый ингредиент в список игрединтов пиццы нашего объекта
                        pizzaAllInfo.Ingredients.Add(new Ingredient(pizzaIngr.Ingredients.Id, pizzaIngr.Ingredients.Name));
                    }

                    //Пробежимся по строчкам таблицы, в которых указаны комбинации характеристик пицц, их вес и цена
                    foreach (var pizzaComb in pizza.PizzaCombinations.OrderBy(x => x.SizeId).ThenBy(x => x.DoughId))
                    {
                        //Добавим каждый вариант комбинации в список комбинаций создав необходимый объект 
                        //с помощью ссылок на строчки из необходимых таблиц характеристик и прочей информации
                        pizzaAllInfo.Combinations.Add(
                            new Combination(pizzaComb.Id, pizzaComb.Sizes.Id, pizzaComb.Sizes.Name, pizzaComb.Doughs.Id, pizzaComb.Doughs.Name, pizzaComb.Weight, pizzaComb.Price));
                    }
                    result.Add(pizzaAllInfo);
                }

                return result;
            }
        }
    }
}
