using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIService.Models
{
    public class OrderIn
    {
        /// <summary>
        /// Список пицц из заказа
        /// </summary>
        public List<PizzaOrder> PizzasOrder { get; set; }
        /// <summary>
        /// Номер телефона
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// Сумма заказа
        /// </summary>
        public decimal AllPrice { get; set; }
        public OrderIn(string phone)
        {
            this.Phone = phone;
            this.PizzasOrder = new List<PizzaOrder>();
        }
    }
    public class PizzaOrder
    {
        /// <summary>
        /// Id пиццы
        /// </summary>
        public int PizzaId { get; set; }
        /// <summary>
        /// Id названия
        /// </summary>
        public int SizeId { get; set; }
        /// <summary>
        /// Id толщины теста
        /// </summary>
        public int DoughId { get; set; }
        /// <summary>
        /// Цена данного варианта пиццы
        /// </summary>
        public decimal Price { get; set; }
        /// <summary>
        /// Список Id доп ингредиентов
        /// </summary>
        public List<int> FreeIngredients { get; set; }

        public PizzaOrder(int pizzaid, int sizeId, int doughId, decimal price)
        {
            this.PizzaId = pizzaid;
            this.SizeId = sizeId;
            this.DoughId = doughId;
            this.Price = price;
            this.FreeIngredients = new List<int>();
        }
    }
}