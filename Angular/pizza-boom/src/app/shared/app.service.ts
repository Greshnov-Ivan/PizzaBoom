import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

export interface FreeIngredient {
  Id: number;
  Name: string;
  Weight: number;
  Price: number;
}

export interface SizesAndDoughs {
  Sizes: Size[];
  Doughs: Dough[];
}
export interface Size {
  Id: number;
  Name: string;
  Diameter: number;
}
export interface Dough {
  Id: number;
  Name: string;
}

export interface Status {
  Id: number;
  Name: string;
}

export interface Ingredient {
  Id: number;
  Name: string;
}
export interface Combination {
  Id: number;
  SizeId: number;
  SizeName: string;
  DoughId: number;
  DoughName: string;
  Weight: number;
  Price: number;
}
export interface Pizza {
  Id: number;
  Name: string;
  Ingredients: Ingredient[];
  Combinations: Combination[];
  FreeInCheck: FreeIngredientCheck[];
  IsSelect: boolean;
}
export interface FreeIngredient {
  Id: number;
  Name: string;
}
export interface FreeIngredientCheck {
  Id: number;
  Checked: boolean;
}
export interface OrdPizza {
  pizzaId: number;
  pizzaName: string;
  sizeId: number;
  sizeName: string;
  doughId: number;
  doughName: string;
  freeIngr: FreeIngredient[];
  price: number;
}
export interface  OrderArchive {
  Id: number;
  StatusId: number;
  Pizzas: OrdPizza[];
}

export interface StatOrder {
  Id: number;
  StatusId: number;
}

export interface PizzaLimit {
  Id: number;
  Limit: number;
}

@Injectable({providedIn: 'root'})
export class AppService {
  public errorAlert = false;
  public errorBuyMes: string;
  public freeIngredients: FreeIngredient[] = [];
  public sizesAndDoughs: SizesAndDoughs;
  public pizzas: Pizza[];
  // По условию задания можно задавать и использовать локально, как я понял
  public pizzaLimits: PizzaLimit[] =
    [ {Id: 1, Limit: 3}, {Id: 2, Limit: 1}, {Id: 3, Limit: 2}, {Id: 4, Limit: 2}, {Id: 5, Limit: 3} ];
  public allPrice: number;
  public ArchiveOrdCount: number;
  public ordersArchive: OrderArchive[];
  public orderPizzas: OrdPizza[];
  public structIndex = [];
  public PizzasInBasketCount: number;
  public AllStatus: Status[];
  constructor(private http: HttpClient) {}

  // Запись заказа в БД и получение id записи
  postOrder(phone: string): any{
    const pizzasOrder = [];
    this.orderPizzas.forEach((value) => {
      const pizzaOrder = {
        PizzaId: value.pizzaId,
        SizeId: value.sizeId,
        DoughId: value.doughId,
        Price: value.price,
        FreeIngredients: []
      };

      if (typeof value.freeIngr !== 'undefined' && value.freeIngr.length > 0)
      {
        value.freeIngr.forEach((ingId: any) => {
          pizzaOrder.FreeIngredients.push(ingId.Id);
        });
      }
      pizzasOrder.push(pizzaOrder);
    });
    const order = {
      PizzasOrder: pizzasOrder,
      AllPrice: this.allPrice,
      Phone: phone
    };
    return this.http.post('https://localhost:44350/api/orders', order);
  }

  // Список свободных ингредиентов, которые можно добавлять
  fetchFreeIngredients(): Observable<FreeIngredient[]> {
    return this.http.get<FreeIngredient[]>( 'https://localhost:44350/api/freeingredients')
      .pipe(tap(freeIngredients => this.freeIngredients = freeIngredients));
  }

  // Полная информация по пиццам, комбинациям...
  fetchPizzasAllInfo(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>( 'https://localhost:44350/api/pizzasallinfo')
      .pipe(tap(pizzas => this.pizzas = pizzas));
  }

  // Получим размеры и толщины пицц
  fetchSizesAndDoughs(): Observable<SizesAndDoughs> {
    return this.http.get<SizesAndDoughs>( 'https://localhost:44350/api/sizesanddoughs')
      .pipe(tap(sizesAndDoughs => this.sizesAndDoughs = sizesAndDoughs));
  }

  // Добавим новый оплаченный и сохраненный в БД заказ в архив localStorage
  saveNewOrderInArchive(newOrderId): void {
    // Id получили после записи в БД, статус начальный (в БД все равно запишется 1 там), список пицц
    this.ordersArchive.push({Id: newOrderId, StatusId: 1, Pizzas: this.orderPizzas});
    this.updateArchiveLocalStorage();
  }

  clearLocalStorage(): void {
    localStorage.clear();
    this.refresh();
  }

  // Очистить архив в localStorage
  clearArchive(): void {
    localStorage.removeItem('OrdersId');
    this.getArchive();
  }

  // Очистить корзину
  clearBasket(): void {
    localStorage.removeItem('orderNow');
    this.getBasket();
  }

  // Обновляет на страницы данные из localStorage
  refresh(): void {
    this.getBasket();
    this.getArchive();
  }

  // Апдейтим текущий НЕОПЛАЧЕННЫЙ заказ со странички в localStorage
  updateBasketLocalStorage(): void {
    const serialObj = JSON.stringify(this.orderPizzas); // сериализуем его
    localStorage.setItem(('orderNow'), serialObj); // запишем получившийся заказ в хранилище по ключу


    // Так как идея заключается в истине лежащей в localStorage
    // Актуализируем корзину на страничке
    this.getBasket();
  }

  // Апдейтим архив в localStorage данными со страницы
  updateArchiveLocalStorage(): void {
    const serialObj = JSON.stringify(this.ordersArchive); // сериализуем его
    localStorage.setItem(('OrdersId'), serialObj); // запишем получившийся заказ в хранилище по ключу

    // Так как идея заключается в истине лежащей в localStorage
    // Актуализируем архив на страничке
    this.getArchive();
  }

  calcellOrder(Id): Observable<any> {
      return this.http.post('https://localhost:44350/api/cancelled', Id);
  }

  // Обновим статусы заказов в архиве
  updateStatus(): Observable<any> {
    this.getArchive(); // Актуализируем список заказов
    const update: any = []; // Готовим список с заказами для обновления статуса
    // Для статусов == 5 нет смысла, поэтому проверим НЕГОТОВЫЕ
    this.ordersArchive.filter(x => x.StatusId < 5)
      .forEach((value) => {
        update.push(value.Id);
      });
    // Если удовлетворяющие нам заказы (неготовые) есть, то пуляем на апдейт
    if (update.length > 0) {
      return this.http.post('https://localhost:44350/api/status', update);
    }
    // Иначе вернём null
    else {
      return null;
    }
  }

  // Получим список заказов из архива localStorage - оплаченные заказы
  getArchive(): void {
    this.ordersArchive = JSON.parse(localStorage.getItem('OrdersId')); // спарсим объект
    if (this.ordersArchive == null) {
      this.ordersArchive = [];
    }
    // Количество заказов в архиве
    this.ArchiveOrdCount = this.ordersArchive.length;
  }

  // Удалим пиццу из ТЕКУЩЕГО заказа
  deletePizza(id: number): void {
    this.orderPizzas.splice(id, 1);

    this.updateBasketLocalStorage();

    // Так как идея заключается в истине лежащей в localStorage
    // Актуализируем текущий заказ на страничке
    this.getBasket();
  }

  // Получить список всех пицц ТЕКУЩЕГО, НЕ ОФОРМЛЕННОГО заказа из localStorage
  getBasket(): void {
    this.allPrice = 0; // Сумма заказа
    this.PizzasInBasketCount = 0; // Кол-во пицц в заказе

    // orderNow - поле для хранения ТЕКУЩЕГО заказа
    this.orderPizzas = JSON.parse(localStorage.getItem('orderNow')); // спарсим объект
    if (this.orderPizzas == null)
    {
      // Если пусто, то проинициализируем пустой массив
      this.orderPizzas = [];
    }

    if (this.orderPizzas.length > 0)
    {
      // Если заказ не пустой, то запишем кол-во пицц
      this.PizzasInBasketCount = this.orderPizzas.length;
      // Посчитаем сумму заказа из сумм за каждую собранную пиццу
      this.orderPizzas
        .forEach((value) => {
          this.allPrice += value.price;
        });
    }
  }

  // Получить список всех статусов из БД
  fetchStatus(): Observable<Status[]> {
    return this.http.get<Status[]>('https://localhost:44350/api/status')
      .pipe(tap(AllStatus => this.AllStatus = AllStatus));
  }
}
