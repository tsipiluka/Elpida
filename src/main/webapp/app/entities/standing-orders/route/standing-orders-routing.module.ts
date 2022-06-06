import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StandingOrdersComponent } from '../list/standing-orders.component';
import { StandingOrdersDetailComponent } from '../detail/standing-orders-detail.component';
import { StandingOrdersUpdateComponent } from '../update/standing-orders-update.component';
import { StandingOrdersRoutingResolveService } from './standing-orders-routing-resolve.service';

const standingOrdersRoute: Routes = [
  {
    path: '',
    component: StandingOrdersComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StandingOrdersDetailComponent,
    resolve: {
      standingOrders: StandingOrdersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StandingOrdersUpdateComponent,
    resolve: {
      standingOrders: StandingOrdersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StandingOrdersUpdateComponent,
    resolve: {
      standingOrders: StandingOrdersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(standingOrdersRoute)],
  exports: [RouterModule],
})
export class StandingOrdersRoutingModule {}
