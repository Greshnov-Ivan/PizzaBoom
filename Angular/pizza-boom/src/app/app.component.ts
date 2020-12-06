import {Component, Injectable, OnInit} from '@angular/core';
import {AppService, Combination, Ingredient, Pizza} from './shared/app.service';

@Injectable({providedIn: 'root'})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pizza-boom';
  displayOrd = 'none';
  displayArch = 'none';
  public loading = true;
  constructor(public appService: AppService) {}
  ngOnInit(): void{
    this.appService.getArchive();
    this.appService.getBasket();
    this.appService.fetchStatus().subscribe(() => {});
    this.appService.fetchPizzasAllInfo().subscribe(() => {
      this.appService.fetchFreeIngredients().subscribe(() => {
        const len: number = this.appService.freeIngredients.length;
        this.appService.fetchSizesAndDoughs().subscribe(() => {
          this.appService.structIndex = [];
          let j = 0;
          let row = [];
          this.appService.pizzas.forEach((pizza): void => {
            if (j % 3 === 0)
            {
              if (row.length > 0)
              {
                this.appService.structIndex.push(row);
                row = [];
              }
            }
            row.push(j);
            j++;
            let i: number;
            pizza.IsSelect = false;
            pizza.FreeInCheck = [];
            for (i = 0; i < len; i++)
            {
              const obj: any = {
                Id: i,
                Checked: false
              };
              pizza.FreeInCheck.push(obj);
            }
          });
          if (row.length > 0)
          {
            this.appService.structIndex.push(row);
            row = [];
          }
          this.loading = false;
        });
      });
    });
  }

  openModalOrder(): void {
    this.displayOrd = 'block';
  }
  onCloseHandledOrder(): void {
    this.displayOrd = 'none';
  }

  openModalArchive(): void {
    this.displayArch = 'block';
  }
  onCloseHandledArchive(): void {
    this.displayArch = 'none';
  }
}
