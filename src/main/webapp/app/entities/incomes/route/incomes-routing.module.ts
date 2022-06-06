import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IncomesComponent } from '../list/incomes.component';
import { IncomesDetailComponent } from '../detail/incomes-detail.component';
import { IncomesUpdateComponent } from '../update/incomes-update.component';
import { IncomesRoutingResolveService } from './incomes-routing-resolve.service';

const incomesRoute: Routes = [
  {
    path: '',
    component: IncomesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IncomesDetailComponent,
    resolve: {
      incomes: IncomesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IncomesUpdateComponent,
    resolve: {
      incomes: IncomesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IncomesUpdateComponent,
    resolve: {
      incomes: IncomesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(incomesRoute)],
  exports: [RouterModule],
})
export class IncomesRoutingModule {}
