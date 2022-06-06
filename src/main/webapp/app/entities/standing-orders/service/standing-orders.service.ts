import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStandingOrders, getStandingOrdersIdentifier } from '../standing-orders.model';

export type EntityResponseType = HttpResponse<IStandingOrders>;
export type EntityArrayResponseType = HttpResponse<IStandingOrders[]>;

@Injectable({ providedIn: 'root' })
export class StandingOrdersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/standing-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(standingOrders: IStandingOrders): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(standingOrders);
    return this.http
      .post<IStandingOrders>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(standingOrders: IStandingOrders): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(standingOrders);
    return this.http
      .put<IStandingOrders>(`${this.resourceUrl}/${getStandingOrdersIdentifier(standingOrders) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(standingOrders: IStandingOrders): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(standingOrders);
    return this.http
      .patch<IStandingOrders>(`${this.resourceUrl}/${getStandingOrdersIdentifier(standingOrders) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IStandingOrders>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IStandingOrders[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStandingOrdersToCollectionIfMissing(
    standingOrdersCollection: IStandingOrders[],
    ...standingOrdersToCheck: (IStandingOrders | null | undefined)[]
  ): IStandingOrders[] {
    const standingOrders: IStandingOrders[] = standingOrdersToCheck.filter(isPresent);
    if (standingOrders.length > 0) {
      const standingOrdersCollectionIdentifiers = standingOrdersCollection.map(
        standingOrdersItem => getStandingOrdersIdentifier(standingOrdersItem)!
      );
      const standingOrdersToAdd = standingOrders.filter(standingOrdersItem => {
        const standingOrdersIdentifier = getStandingOrdersIdentifier(standingOrdersItem);
        if (standingOrdersIdentifier == null || standingOrdersCollectionIdentifiers.includes(standingOrdersIdentifier)) {
          return false;
        }
        standingOrdersCollectionIdentifiers.push(standingOrdersIdentifier);
        return true;
      });
      return [...standingOrdersToAdd, ...standingOrdersCollection];
    }
    return standingOrdersCollection;
  }

  protected convertDateFromClient(standingOrders: IStandingOrders): IStandingOrders {
    return Object.assign({}, standingOrders, {
      date: standingOrders.date?.isValid() ? standingOrders.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((standingOrders: IStandingOrders) => {
        standingOrders.date = standingOrders.date ? dayjs(standingOrders.date) : undefined;
      });
    }
    return res;
  }
}
