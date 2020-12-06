using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIService.Models
{
    public class SizesAndDoughs
    {
        /// <summary>
        /// Список размеров
        /// </summary>
        public List<Size> Sizes { get; set; }
        /// <summary>
        /// Список толщин
        /// </summary>
        public List<Dough> Doughs { get; set; }

        public SizesAndDoughs()
        {
            this.Sizes = new List<Size>();
            this.Doughs = new List<Dough>();
        }
    }
    public class Size
    {
        //Id размера
        public int Id { get; set; }
        //Название размера
        public string Name { get; set; }
        //Диаметр
        public byte Diameter { get; set; }

        public Size(int id, string name, byte diametr)
        {
            this.Id = id;
            this.Name = name;
            this.Diameter = diametr;
        }
    }

    public class Dough
    {
        //Id толщины
        public int Id { get; set; }
        //Название толщины
        public string Name { get; set; }

        public Dough(int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
    }
}