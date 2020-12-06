import {Component, OnInit} from '@angular/core';
import {AppService} from '../shared/app.service';
@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
  interpolation: ['{{', '}}']
})

export class BasketComponent implements OnInit {

  numberPhone: string;
  private regexp: RegExp;
  errorNumber: boolean;
  successAlert: boolean;
  errorBuyMes: string;
  errorAlert: boolean;

  constructor(public appService: AppService) {
  }

  ngOnInit(): void {
    // Обновим список пицц из localStorage
    // Понимаю, что скорее всего эти лишнии обновления только утяжеляют странику,
    // но пока она маленькая, лучше перестраховаться))
    this.appService.getBasket();
    // Флажок и алерты по умолчанию false
    this.errorNumber = false;
    this.successAlert = false;
    this.errorAlert = false;
  }

  // Покупка - новый заказ. Пишем в БД и архив localStorage
  buy(phone: string): void {
    // Флаг ошибки в номере - обратный успешной проверки
    this.errorNumber = !this.checkPhone(phone);
    // Ошибки нет, продолжаем оформление покупки
    if (!this.errorNumber)
    {
      // Post запрос на запись в БД, ждем в ответе айдишник заказа
      this.appService.postOrder(this.numberPhone).subscribe(
        (data: number) => {this.appService.saveNewOrderInArchive(data);
                           this.successAlert = true;
                           // Со временем убираем успешный алерт и чистим корзину
                           setTimeout(() => {
                             this.successAlert = false;
                             this.appService.clearBasket();
                            }, 1000);
                           this.errorAlert = false;
        },
        // Ошибка, показываем соответствующий алерт
        error => {this.errorBuyMes = error.error.Message; this.errorAlert = true; this.successAlert = false; }
      );
    }
  }

  // Проверим номер сотового (проверка примитивная, усилия решил приложить в других аспектах =) )
  // Регулярку знал раньше, сейчас подзабыл синтаксис, сил не было уже разбираться
  checkPhone(phone: string): boolean {
    this.numberPhone = phone;
    let result: boolean;
    // Номер должен быть вида 89879579109
    this.regexp = new RegExp('^89\\d{9}$'),
      result = this.regexp.test(this.numberPhone);
    return(result);
  }
}
