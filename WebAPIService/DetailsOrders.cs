//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebAPIService
{
    using System;
    using System.Collections.Generic;
    
    public partial class DetailsOrders
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int PizzaId { get; set; }
        public int SizeId { get; set; }
        public int DoughId { get; set; }
        public Nullable<int> FreeIngredientId { get; set; }
    
        public virtual Doughs Doughs { get; set; }
        public virtual Orders Orders { get; set; }
        public virtual Pizzas Pizzas { get; set; }
        public virtual Sizes Sizes { get; set; }
    }
}
