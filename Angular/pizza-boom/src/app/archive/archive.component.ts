import { Component, OnInit } from '@angular/core';
import { AppService, StatOrder, OrderArchive} from '../shared/app.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
  interpolation: ['{{', '}}']
})

export class ArchiveComponent implements OnInit {
  errorBuyMes: string;
  errorAlert: boolean;
  isVisible: boolean;
  successCancell: boolean;
  freshOrders: OrderArchive[] = [];
  alreadOrders: OrderArchive[] = [];

  constructor(public appService: AppService) {
  }

  ngOnInit(): void {
    // Обновим данные перед работой
    this.updateStatus();
    // Получим список старых заказов
    this.filterAlreadyOrders();
    // Флаг показывать ли старые заказы
    this.isVisible = false;

    this.successCancell = false;
  }

  reverseIsVisible(): void {
    this.isVisible = !this.isVisible ;
  }

  filterAlreadyOrders(): void {
    // Заказы со статусом 5 (готовые)
    this.alreadOrders = this.appService.ordersArchive.filter(x => x.StatusId === 5);
  }

  // отменить заказ. Проверка на сервере
  cancellOrder(orderId): void {
    this.appService.calcellOrder(orderId).subscribe(
      (data: boolean) => {
        this.successCancell = data;
        if (this.successCancell)
        {
          this.appService.ordersArchive = this.appService.ordersArchive.filter(f => f.Id !== orderId);
          this.freshOrders = this.freshOrders.filter(f => f.Id !== orderId);

          this.appService.updateArchiveLocalStorage();
          alert('Заказ успешно отклонен');
        }
        else
        {
          alert('К сожалению, Вы не успели отменить заказ - он уже готов.');
        }
      },
      // Ошибка, показываем соответствующий алерт
      error => {
        this.errorBuyMes = error.error.Message;
        this.errorAlert = true;
        setTimeout(() => {
          this.errorAlert = false;
        }, 4000);
      }
    );
  }

  // Обновим статусы неготовых заказов
  updateStatus(): void {
    // Актуализируем архив на страничке
    // this.appService.getArchive();
    // Сфорируем сразу нужный список актуальных, готовящихся заказов для дальнейшего отображения
    this.freshOrders = [];

    // this.appService.refresh();
    const updateStatus = this.appService.updateStatus(); // Будут получены новые актуальные статусы наших заказов
    if (updateStatus != null) {
      updateStatus.subscribe(
        (data: StatOrder[]) => {
          data.forEach((stOr: StatOrder) => {
            // Возьмем текущий заказ архивный из перебора пришедших
            const obj: OrderArchive = this.appService.ordersArchive
              .find(order => order.Id === stOr.Id);

            // Актуализируем его статус
            obj.StatusId = stOr.StatusId;

            this.freshOrders.push(obj);
          });

          // Актуализируем наш архив в localStorage
          this.appService.updateArchiveLocalStorage();

          this.errorAlert = false;

          this.filterAlreadyOrders();
        },
        error => {
          this.errorBuyMes = error.error.Message;
          this.errorAlert = true;
        }
      );
    }
  }
}
