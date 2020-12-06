using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIService.Models
{
    /// <summary>
    /// Полная информация по пицце
    /// </summary>
    public class PizzaAllInfo
    {
        /// <summary>
        /// Id пиццы в таблице Pizzas
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Название пиццы
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Список используемых ингредиентов
        /// </summary>
        public List<Ingredient> Ingredients { get; set; }
        /// <summary>
        /// Список вариантов данной пиццы
        /// </summary>
        public List<Combination> Combinations { get; set; }

        //public PizzaAllInfo(int pizzzaId, string pizzaName, int ingredientId, string ingredientName, int combinationId, string combinationSize, string combinationDough, int combinationWeight, decimal combinationPrice)
        public PizzaAllInfo(int pizzzaId, string pizzaName)
        {
            this.Id = pizzzaId;
            this.Name = pizzaName;
            this.Ingredients = new List<Ingredient>();
            this.Combinations = new List<Combination>();
        }
    }
}