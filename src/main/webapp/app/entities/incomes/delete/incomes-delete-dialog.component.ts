import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIncomes } from '../incomes.model';
import { IncomesService } from '../service/incomes.service';

@Component({
  templateUrl: './incomes-delete-dialog.component.html',
})
export class IncomesDeleteDialogComponent {
  incomes?: IIncomes;

  constructor(protected incomesService: IncomesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.incomesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
