using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIService.Models
{
    public class MyStatus
    {
        /// <summary>
        /// Id
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Статус
        /// </summary>
        public string Name { get; set; }
        public MyStatus(int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
    }
    public class StatOrder
    {
        /// <summary>
        /// Id заказа
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Статус Id
        /// </summary>
        public int StatusId { get; set; }
        public StatOrder(int id, int statusId)
        {
            this.Id = id;
            this.StatusId = statusId;
        }
    }
}