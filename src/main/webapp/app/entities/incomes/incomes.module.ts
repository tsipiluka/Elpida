import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IncomesComponent } from './list/incomes.component';
import { IncomesDetailComponent } from './detail/incomes-detail.component';
import { IncomesUpdateComponent } from './update/incomes-update.component';
import { IncomesDeleteDialogComponent } from './delete/incomes-delete-dialog.component';
import { IncomesRoutingModule } from './route/incomes-routing.module';

@NgModule({
  imports: [SharedModule, IncomesRoutingModule],
  declarations: [IncomesComponent, IncomesDetailComponent, IncomesUpdateComponent, IncomesDeleteDialogComponent],
  entryComponents: [IncomesDeleteDialogComponent],
})
export class IncomesModule {}
