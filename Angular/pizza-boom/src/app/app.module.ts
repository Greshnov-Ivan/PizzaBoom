import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PizzaComponent} from './pizza/pizza.component';
import { CardComponent } from './card/card.component';
import { BasketComponent } from './basket/basket.component';
import { OrderComponent } from './order/order.component';
import { ArchiveComponent } from './archive/archive.component';

@NgModule({
  declarations: [
    AppComponent,
    PizzaComponent,
    CardComponent,
    BasketComponent,
    OrderComponent,
    ArchiveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
