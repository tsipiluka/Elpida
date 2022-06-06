import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStandingOrders, StandingOrders } from '../standing-orders.model';
import { StandingOrdersService } from '../service/standing-orders.service';

@Injectable({ providedIn: 'root' })
export class StandingOrdersRoutingResolveService implements Resolve<IStandingOrders> {
  constructor(protected service: StandingOrdersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStandingOrders> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((standingOrders: HttpResponse<StandingOrders>) => {
          if (standingOrders.body) {
            return of(standingOrders.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StandingOrders());
  }
}
