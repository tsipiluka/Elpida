import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStandingOrders } from '../standing-orders.model';

@Component({
  selector: 'jhi-standing-orders-detail',
  templateUrl: './standing-orders-detail.component.html',
})
export class StandingOrdersDetailComponent implements OnInit {
  standingOrders: IStandingOrders | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ standingOrders }) => {
      this.standingOrders = standingOrders;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
