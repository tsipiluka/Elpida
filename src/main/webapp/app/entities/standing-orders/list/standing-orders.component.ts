import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStandingOrders } from '../standing-orders.model';
import { StandingOrdersService } from '../service/standing-orders.service';
import { StandingOrdersDeleteDialogComponent } from '../delete/standing-orders-delete-dialog.component';

@Component({
  selector: 'jhi-standing-orders',
  templateUrl: './standing-orders.component.html',
})
export class StandingOrdersComponent implements OnInit {
  standingOrders?: IStandingOrders[];
  isLoading = false;

  constructor(protected standingOrdersService: StandingOrdersService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.standingOrdersService.query().subscribe({
      next: (res: HttpResponse<IStandingOrders[]>) => {
        this.isLoading = false;
        this.standingOrders = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IStandingOrders): number {
    return item.id!;
  }

  delete(standingOrders: IStandingOrders): void {
    const modalRef = this.modalService.open(StandingOrdersDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.standingOrders = standingOrders;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
