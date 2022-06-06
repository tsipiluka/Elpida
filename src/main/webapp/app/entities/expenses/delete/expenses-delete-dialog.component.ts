import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExpenses } from '../expenses.model';
import { ExpensesService } from '../service/expenses.service';

@Component({
  templateUrl: './expenses-delete-dialog.component.html',
})
export class ExpensesDeleteDialogComponent {
  expenses?: IExpenses;

  constructor(protected expensesService: ExpensesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.expensesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
