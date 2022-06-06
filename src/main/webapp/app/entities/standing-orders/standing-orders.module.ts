import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StandingOrdersComponent } from './list/standing-orders.component';
import { StandingOrdersDetailComponent } from './detail/standing-orders-detail.component';
import { StandingOrdersUpdateComponent } from './update/standing-orders-update.component';
import { StandingOrdersDeleteDialogComponent } from './delete/standing-orders-delete-dialog.component';
import { StandingOrdersRoutingModule } from './route/standing-orders-routing.module';

@NgModule({
  imports: [SharedModule, StandingOrdersRoutingModule],
  declarations: [
    StandingOrdersComponent,
    StandingOrdersDetailComponent,
    StandingOrdersUpdateComponent,
    StandingOrdersDeleteDialogComponent,
  ],
  entryComponents: [StandingOrdersDeleteDialogComponent],
})
export class StandingOrdersModule {}
