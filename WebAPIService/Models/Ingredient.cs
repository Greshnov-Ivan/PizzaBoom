using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIService.Models
{
    /// <summary>
    /// Краткое описание ингредиента
    /// </summary>
    public class Ingredient
    {
        /// <summary>
        /// Id ингредиента в таблице Ingredients
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Название ингредиента
        /// </summary>
        public string Name { get; set; }

        public Ingredient (int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
    }
    /// <summary>
    /// Ингредиент, который можно добавлять дополнительно к выбранной пицце
    /// </summary>
    public class FreeIngredient: Ingredient
    {
        /// <summary>
        /// Вес ингредиента
        /// </summary>
        public int Weight { get; set; }
        /// <summary>
        /// Цена ингредиента
        /// </summary>
        public decimal Price { get; set; }

        public FreeIngredient(int id, string name, int weight, decimal price): base(id, name)
        {
            this.Weight = weight;
            this.Price = price;
        }
    }
}