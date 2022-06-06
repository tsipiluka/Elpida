import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExpenses, getExpensesIdentifier } from '../expenses.model';

export type EntityResponseType = HttpResponse<IExpenses>;
export type EntityArrayResponseType = HttpResponse<IExpenses[]>;

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/expenses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(expenses: IExpenses): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenses);
    return this.http
      .post<IExpenses>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(expenses: IExpenses): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenses);
    return this.http
      .put<IExpenses>(`${this.resourceUrl}/${getExpensesIdentifier(expenses) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(expenses: IExpenses): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenses);
    return this.http
      .patch<IExpenses>(`${this.resourceUrl}/${getExpensesIdentifier(expenses) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IExpenses>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExpenses[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExpensesToCollectionIfMissing(expensesCollection: IExpenses[], ...expensesToCheck: (IExpenses | null | undefined)[]): IExpenses[] {
    const expenses: IExpenses[] = expensesToCheck.filter(isPresent);
    if (expenses.length > 0) {
      const expensesCollectionIdentifiers = expensesCollection.map(expensesItem => getExpensesIdentifier(expensesItem)!);
      const expensesToAdd = expenses.filter(expensesItem => {
        const expensesIdentifier = getExpensesIdentifier(expensesItem);
        if (expensesIdentifier == null || expensesCollectionIdentifiers.includes(expensesIdentifier)) {
          return false;
        }
        expensesCollectionIdentifiers.push(expensesIdentifier);
        return true;
      });
      return [...expensesToAdd, ...expensesCollection];
    }
    return expensesCollection;
  }

  protected convertDateFromClient(expenses: IExpenses): IExpenses {
    return Object.assign({}, expenses, {
      date: expenses.date?.isValid() ? expenses.date.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((expenses: IExpenses) => {
        expenses.date = expenses.date ? dayjs(expenses.date) : undefined;
      });
    }
    return res;
  }
}
