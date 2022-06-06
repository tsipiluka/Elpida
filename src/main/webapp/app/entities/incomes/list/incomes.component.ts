import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIncomes } from '../incomes.model';
import { IncomesService } from '../service/incomes.service';
import { IncomesDeleteDialogComponent } from '../delete/incomes-delete-dialog.component';

@Component({
  selector: 'jhi-incomes',
  templateUrl: './incomes.component.html',
})
export class IncomesComponent implements OnInit {
  incomes?: IIncomes[];
  isLoading = false;

  constructor(protected incomesService: IncomesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.incomesService.query().subscribe({
      next: (res: HttpResponse<IIncomes[]>) => {
        this.isLoading = false;
        this.incomes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IIncomes): number {
    return item.id!;
  }

  delete(incomes: IIncomes): void {
    const modalRef = this.modalService.open(IncomesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.incomes = incomes;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
