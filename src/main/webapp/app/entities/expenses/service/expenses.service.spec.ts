import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IExpenses, Expenses } from '../expenses.model';

import { ExpensesService } from './expenses.service';

describe('Expenses Service', () => {
  let service: ExpensesService;
  let httpMock: HttpTestingController;
  let elemDefault: IExpenses;
  let expectedResult: IExpenses | IExpenses[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExpensesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      iD: 0,
      name: 'AAAAAAA',
      value: 0,
      date: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Expenses', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Expenses()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Expenses', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          iD: 1,
          name: 'BBBBBB',
          value: 1,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Expenses', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          value: 1,
        },
        new Expenses()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Expenses', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          iD: 1,
          name: 'BBBBBB',
          value: 1,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Expenses', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExpensesToCollectionIfMissing', () => {
      it('should add a Expenses to an empty array', () => {
        const expenses: IExpenses = { id: 123 };
        expectedResult = service.addExpensesToCollectionIfMissing([], expenses);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(expenses);
      });

      it('should not add a Expenses to an array that contains it', () => {
        const expenses: IExpenses = { id: 123 };
        const expensesCollection: IExpenses[] = [
          {
            ...expenses,
          },
          { id: 456 },
        ];
        expectedResult = service.addExpensesToCollectionIfMissing(expensesCollection, expenses);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Expenses to an array that doesn't contain it", () => {
        const expenses: IExpenses = { id: 123 };
        const expensesCollection: IExpenses[] = [{ id: 456 }];
        expectedResult = service.addExpensesToCollectionIfMissing(expensesCollection, expenses);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(expenses);
      });

      it('should add only unique Expenses to an array', () => {
        const expensesArray: IExpenses[] = [{ id: 123 }, { id: 456 }, { id: 51192 }];
        const expensesCollection: IExpenses[] = [{ id: 123 }];
        expectedResult = service.addExpensesToCollectionIfMissing(expensesCollection, ...expensesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const expenses: IExpenses = { id: 123 };
        const expenses2: IExpenses = { id: 456 };
        expectedResult = service.addExpensesToCollectionIfMissing([], expenses, expenses2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(expenses);
        expect(expectedResult).toContain(expenses2);
      });

      it('should accept null and undefined values', () => {
        const expenses: IExpenses = { id: 123 };
        expectedResult = service.addExpensesToCollectionIfMissing([], null, expenses, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(expenses);
      });

      it('should return initial array if no Expenses is added', () => {
        const expensesCollection: IExpenses[] = [{ id: 123 }];
        expectedResult = service.addExpensesToCollectionIfMissing(expensesCollection, undefined, null);
        expect(expectedResult).toEqual(expensesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
