import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStandingOrders } from '../standing-orders.model';
import { StandingOrdersService } from '../service/standing-orders.service';

@Component({
  templateUrl: './standing-orders-delete-dialog.component.html',
})
export class StandingOrdersDeleteDialogComponent {
  standingOrders?: IStandingOrders;

  constructor(protected standingOrdersService: StandingOrdersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.standingOrdersService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
