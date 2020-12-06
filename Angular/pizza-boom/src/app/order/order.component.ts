import {Component, OnInit} from '@angular/core';
import {AppService} from '../shared/app.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  interpolation: ['{{', '}}']
})
export class OrderComponent implements OnInit {
  constructor(public appService: AppService) {
  }
  ngOnInit(): void {

  }
}
