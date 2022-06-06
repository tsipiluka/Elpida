import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IIncomes, Incomes } from '../incomes.model';

import { IncomesService } from './incomes.service';

describe('Incomes Service', () => {
  let service: IncomesService;
  let httpMock: HttpTestingController;
  let elemDefault: IIncomes;
  let expectedResult: IIncomes | IIncomes[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IncomesService);
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

    it('should create a Incomes', () => {
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

      service.create(new Incomes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Incomes', () => {
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

    it('should partial update a Incomes', () => {
      const patchObject = Object.assign(
        {
          iD: 1,
          name: 'BBBBBB',
        },
        new Incomes()
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

    it('should return a list of Incomes', () => {
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

    it('should delete a Incomes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIncomesToCollectionIfMissing', () => {
      it('should add a Incomes to an empty array', () => {
        const incomes: IIncomes = { id: 123 };
        expectedResult = service.addIncomesToCollectionIfMissing([], incomes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(incomes);
      });

      it('should not add a Incomes to an array that contains it', () => {
        const incomes: IIncomes = { id: 123 };
        const incomesCollection: IIncomes[] = [
          {
            ...incomes,
          },
          { id: 456 },
        ];
        expectedResult = service.addIncomesToCollectionIfMissing(incomesCollection, incomes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Incomes to an array that doesn't contain it", () => {
        const incomes: IIncomes = { id: 123 };
        const incomesCollection: IIncomes[] = [{ id: 456 }];
        expectedResult = service.addIncomesToCollectionIfMissing(incomesCollection, incomes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(incomes);
      });

      it('should add only unique Incomes to an array', () => {
        const incomesArray: IIncomes[] = [{ id: 123 }, { id: 456 }, { id: 41719 }];
        const incomesCollection: IIncomes[] = [{ id: 123 }];
        expectedResult = service.addIncomesToCollectionIfMissing(incomesCollection, ...incomesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const incomes: IIncomes = { id: 123 };
        const incomes2: IIncomes = { id: 456 };
        expectedResult = service.addIncomesToCollectionIfMissing([], incomes, incomes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(incomes);
        expect(expectedResult).toContain(incomes2);
      });

      it('should accept null and undefined values', () => {
        const incomes: IIncomes = { id: 123 };
        expectedResult = service.addIncomesToCollectionIfMissing([], null, incomes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(incomes);
      });

      it('should return initial array if no Incomes is added', () => {
        const incomesCollection: IIncomes[] = [{ id: 123 }];
        expectedResult = service.addIncomesToCollectionIfMissing(incomesCollection, undefined, null);
        expect(expectedResult).toEqual(incomesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
