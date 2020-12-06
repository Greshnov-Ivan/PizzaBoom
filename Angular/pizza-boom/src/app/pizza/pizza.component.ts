import {Component, Input, OnInit} from '@angular/core';
import {AppService, Combination, Ingredient, Pizza} from '../shared/app.service';
@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css'],
  interpolation: ['{{', '}}']
})
export class PizzaComponent implements OnInit {
  @Input() pizza: Pizza;
  ingredients = 'Ingrediets';
  imgUrl;
  constructor(public appService: AppService) {}
  ngOnInit(): void{
    this.imgUrl = '/assets/images/' + this.pizza.Id + '.png';
  }
  selected(): void {
    this.pizza.IsSelect = !this.pizza.IsSelect;
  }
}
