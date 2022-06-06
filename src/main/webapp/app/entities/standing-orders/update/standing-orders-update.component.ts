import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IStandingOrders, StandingOrders } from '../standing-orders.model';
import { StandingOrdersService } from '../service/standing-orders.service';

@Component({
  selector: 'jhi-standing-orders-update',
  templateUrl: './standing-orders-update.component.html',
})
export class StandingOrdersUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    iD: [null, [Validators.required]],
    name: [null, [Validators.required]],
    value: [null, [Validators.required]],
    date: [null, [Validators.required]],
    interval: [null, [Validators.required]],
  });

  constructor(
    protected standingOrdersService: StandingOrdersService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ standingOrders }) => {
      this.updateForm(standingOrders);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const standingOrders = this.createFromForm();
    if (standingOrders.id !== undefined) {
      this.subscribeToSaveResponse(this.standingOrdersService.update(standingOrders));
    } else {
      this.subscribeToSaveResponse(this.standingOrdersService.create(standingOrders));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStandingOrders>>): void {
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

  protected updateForm(standingOrders: IStandingOrders): void {
    this.editForm.patchValue({
      id: standingOrders.id,
      iD: standingOrders.iD,
      name: standingOrders.name,
      value: standingOrders.value,
      date: standingOrders.date,
      interval: standingOrders.interval,
    });
  }

  protected createFromForm(): IStandingOrders {
    return {
      ...new StandingOrders(),
      id: this.editForm.get(['id'])!.value,
      iD: this.editForm.get(['iD'])!.value,
      name: this.editForm.get(['name'])!.value,
      value: this.editForm.get(['value'])!.value,
      date: this.editForm.get(['date'])!.value,
      interval: this.editForm.get(['interval'])!.value,
    };
  }
}
