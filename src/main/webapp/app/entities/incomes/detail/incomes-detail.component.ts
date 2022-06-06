import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIncomes } from '../incomes.model';

@Component({
  selector: 'jhi-incomes-detail',
  templateUrl: './incomes-detail.component.html',
})
export class IncomesDetailComponent implements OnInit {
  incomes: IIncomes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ incomes }) => {
      this.incomes = incomes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
