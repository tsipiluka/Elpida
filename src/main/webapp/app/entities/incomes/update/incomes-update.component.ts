import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IIncomes, Incomes } from '../incomes.model';
import { IncomesService } from '../service/incomes.service';

@Component({
  selector: 'jhi-incomes-update',
  templateUrl: './incomes-update.component.html',
})
export class IncomesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    iD: [null, [Validators.required]],
    name: [null, [Validators.required]],
    value: [null, [Validators.required]],
    date: [null, [Validators.required]],
  });

  constructor(protected incomesService: IncomesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ incomes }) => {
      this.updateForm(incomes);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const incomes = this.createFromForm();
    if (incomes.id !== undefined) {
      this.subscribeToSaveResponse(this.incomesService.update(incomes));
    } else {
      this.subscribeToSaveResponse(this.incomesService.create(incomes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIncomes>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(incomes: IIncomes): void {
    this.editForm.patchValue({
      id: incomes.id,
      iD: incomes.iD,
      name: incomes.name,
      value: incomes.value,
      date: incomes.date,
    });
  }

  protected createFromForm(): IIncomes {
    return {
      ...new Incomes(),
      id: this.editForm.get(['id'])!.value,
      iD: this.editForm.get(['iD'])!.value,
      name: this.editForm.get(['name'])!.value,
      value: this.editForm.get(['value'])!.value,
      date: this.editForm.get(['date'])!.value,
    };
  }
}
