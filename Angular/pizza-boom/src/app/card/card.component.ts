import {Component, Input, OnInit} from '@angular/core';
import {AppService, Pizza} from '../shared/app.service';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  interpolation: ['{{', '}}']
})
export class CardComponent implements OnInit {
  @Input() pizza: Pizza;
  price;
  sizeId;
  doughId;

  constructor(public appService: AppService) {
  }

  ngOnInit(): void {
    // Установим начальную цену пиццы в текущей карточке
    // Дергая данные с БД список комбинаций был отсортирован по размерам и толщинам,
    // соответственно цена у перой минимальная.
    // Если будут какие-то изменения в ценообразовании, то лучше сначала сортануть по цене
    this.price = this.pizza.Combinations[0].Price;
    // Установим дефолтные размер и толщину минимальными
    this.sizeId = this.appService.sizesAndDoughs.Sizes[0].Id;
    this.doughId = this.appService.sizesAndDoughs.Doughs[0].Id;
    // Инициализируем при открытие карточ все ингредиенты невыбранными.
    this.pizza.FreeInCheck.forEach((value) => {
      value.Checked = false;
    });
  }

  // Чекнули доп ингредиент
  selectIngredient(ing): void {
    // Не получилось сходу забандиться, позже разберусь
    // Работаем руками, что очень плохо
    ing.Checked = !ing.Checked;
    // Такой пересчет цены может повлечь баги, на сервере доп проверка суммы
    if (ing.Checked) {
      this.price += this.appService.freeIngredients[ing.Id].Price;
    } else {
      this.price -= this.appService.freeIngredients[ing.Id].Price;
    }
  }

  // Выбран размер или толщина текущей пиццы
  selSizeOrDough(name, value): void {
    // Старая комбинация пиццы
    const CombOld = this.pizza.Combinations.find(c => c.DoughId === this.doughId && c.SizeId === this.sizeId);

    if (name === 'size')
    {
      this.sizeId = +value; // Парсим к численному значению айдишника размера - присваиваем новое значение
    }
    if (name === 'dough')
    {
      this.doughId = +value;
    }

    // Новая комбинация
    const CombNew = this.pizza.Combinations.find(c => c.DoughId === this.doughId && c.SizeId === this.sizeId);
    // Пересчет цены
    this.price += CombNew.Price - CombOld.Price;
  }

  // Добавим собранную пиццу в корзину с нашей карточки
  AddPizzaInBasket(): void {
    // Проверим добавляемую пиццу на лимит
    const limit = this.appService.pizzaLimits.find(x => x.Id === this.pizza.Id).Limit;
    if (limit > this.appService.orderPizzas.filter(p => p.pizzaId === this.pizza.Id).length)
    {
      // Создадим объект
      const pizza = {
        pizzaId: this.pizza.Id,
        pizzaName: this.pizza.Name,
        sizeId: this.sizeId,
        sizeName: this.appService.sizesAndDoughs.Sizes.find(x => x.Id === this.sizeId).Name,
        doughId: this.doughId,
        doughName: this.appService.sizesAndDoughs.Doughs.find(x => x.Id === this.doughId).Name,
        freeIngr: [],
        price: this.price
      };

      // Отфильтруем помеченные (выбранные) доп ингредиенты
      // и запушим в массив к нашему объекту в соответствующее поле
      this.pizza.FreeInCheck
        .filter(ing => ing.Checked)
        .forEach((value) => {
          const freeIngr = this.appService.freeIngredients[value.Id];
          pizza.freeIngr.push({Id: freeIngr.Id, Name: freeIngr.Name});
        });

      // Добавим собранный объект к заказу на страничке
      this.appService.orderPizzas.push(pizza);

      // Апдейтим корзину в localStorage
      this.appService.updateBasketLocalStorage();

      this.pizza.IsSelect = false;
    }
    else
    {
      alert('Внимание! Вы достигли лимита ' + limit + ' штук пиццы ' + this.pizza.Name + ' за заказ');
    }
  }
}
