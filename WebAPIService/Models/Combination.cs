using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIService.Models
{
    /// <summary>
    ///  Описание варианта пиццы
    /// </summary>
    public class Combination
    {
        /// <summary>
        /// Id данного варианта пиццы в таблице Ingredients
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Id размера
        /// </summary>
        public int SizeId { get; set; }
        /// <summary>
        /// Название размера пиццы
        /// </summary>
        public string SizeName { get; set; }
        /// <summary>
        /// Id толщины теста
        /// </summary>
        public int DoughId { get; set; }
        /// /// <summary>
        /// Название толщины теста
        /// </summary>
        public string DoughName { get; set; }
        /// <summary>
        /// Вес данного варианта пиццы
        /// </summary>
        public int Weight { get; set; }
        /// <summary>
        /// Цена данного варианта пиццы
        /// </summary>
        public decimal Price { get; set; }

        public Combination(int id, int sizeId, string size, int doughId, string dough, int weight, decimal price)
        {
            this.Id = id;
            this.SizeId = sizeId;
            this.DoughId = doughId;
            this.SizeName = size;
            this.DoughName = dough;
            this.Weight = weight;
            this.Price = price;
        }
    }
}