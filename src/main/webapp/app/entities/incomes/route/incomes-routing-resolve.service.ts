import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIncomes, Incomes } from '../incomes.model';
import { IncomesService } from '../service/incomes.service';

@Injectable({ providedIn: 'root' })
export class IncomesRoutingResolveService implements Resolve<IIncomes> {
  constructor(protected service: IncomesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIncomes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((incomes: HttpResponse<Incomes>) => {
          if (incomes.body) {
            return of(incomes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Incomes());
  }
}
