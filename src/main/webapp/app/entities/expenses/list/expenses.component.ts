import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExpenses } from '../expenses.model';
import { ExpensesService } from '../service/expenses.service';
import { ExpensesDeleteDialogComponent } from '../delete/expenses-delete-dialog.component';

@Component({
  selector: 'jhi-expenses',
  templateUrl: './expenses.component.html',
})
export class ExpensesComponent implements OnInit {
  expenses?: IExpenses[];
  isLoading = false;

  constructor(protected expensesService: ExpensesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.expensesService.query().subscribe({
      next: (res: HttpResponse<IExpenses[]>) => {
        this.isLoading = false;
        this.expenses = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IExpenses): number {
    return item.id!;
  }

  delete(expenses: IExpenses): void {
    const modalRef = this.modalService.open(ExpensesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.expenses = expenses;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
