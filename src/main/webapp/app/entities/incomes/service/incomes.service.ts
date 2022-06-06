import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIncomes, getIncomesIdentifier } from '../incomes.model';

export type EntityResponseType = HttpResponse<IIncomes>;
export type EntityArrayResponseType = HttpResponse<IIncomes[]>;

@Injectable({ providedIn: 'root' })
export class IncomesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/incomes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(incomes: IIncomes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(incomes);
    return this.http
      .post<IIncomes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(incomes: IIncomes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(incomes);
    return this.http
      .put<IIncomes>(`${this.resourceUrl}/${getIncomesIdentifier(incomes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(incomes: IIncomes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(incomes);
    return this.http
      .patch<IIncomes>(`${this.resourceUrl}/${getIncomesIdentifier(incomes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIncomes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIncomes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIncomesToCollectionIfMissing(incomesCollection: IIncomes[], ...incomesToCheck: (IIncomes | null | undefined)[]): IIncomes[] {
    const incomes: IIncomes[] = incomesToCheck.filter(isPresent);
    if (incomes.length > 0) {
      const incomesCollectionIdentifiers = incomesCollection.map(incomesItem => getIncomesIdentifier(incomesItem)!);
      const incomesToAdd = incomes.filter(incomesItem => {
        const incomesIdentifier = getIncomesIdentifier(incomesItem);
        if (incomesIdentifier == null || incomesCollectionIdentifiers.includes(incomesIdentifier)) {
          return false;
        }
        incomesCollectionIdentifiers.push(incomesIdentifier);
        return true;
      });
      return [...incomesToAdd, ...incomesCollection];
    }
    return incomesCollection;
  }

  protected convertDateFromClient(incomes: IIncomes): IIncomes {
    return Object.assign({}, incomes, {
      date: incomes.date?.isValid() ? incomes.date.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((incomes: IIncomes) => {
        incomes.date = incomes.date ? dayjs(incomes.date) : undefined;
      });
    }
    return res;
  }
}
