import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IStandingOrders, StandingOrders } from '../standing-orders.model';

import { StandingOrdersService } from './standing-orders.service';

describe('StandingOrders Service', () => {
  let service: StandingOrdersService;
  let httpMock: HttpTestingController;
  let elemDefault: IStandingOrders;
  let expectedResult: IStandingOrders | IStandingOrders[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StandingOrdersService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      iD: 0,
      name: 'AAAAAAA',
      value: 0,
      date: currentDate,
      interval: 0,
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

    it('should create a StandingOrders', () => {
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

      service.create(new StandingOrders()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StandingOrders', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          iD: 1,
          name: 'BBBBBB',
          value: 1,
          date: currentDate.format(DATE_FORMAT),
          interval: 1,
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

    it('should partial update a StandingOrders', () => {
      const patchObject = Object.assign(
        {
          iD: 1,
          name: 'BBBBBB',
        },
        new StandingOrders()
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

    it('should return a list of StandingOrders', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          iD: 1,
          name: 'BBBBBB',
          value: 1,
          date: currentDate.format(DATE_FORMAT),
          interval: 1,
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

    it('should delete a StandingOrders', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStandingOrdersToCollectionIfMissing', () => {
      it('should add a StandingOrders to an empty array', () => {
        const standingOrders: IStandingOrders = { id: 123 };
        expectedResult = service.addStandingOrdersToCollectionIfMissing([], standingOrders);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(standingOrders);
      });

      it('should not add a StandingOrders to an array that contains it', () => {
        const standingOrders: IStandingOrders = { id: 123 };
        const standingOrdersCollection: IStandingOrders[] = [
          {
            ...standingOrders,
          },
          { id: 456 },
        ];
        expectedResult = service.addStandingOrdersToCollectionIfMissing(standingOrdersCollection, standingOrders);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StandingOrders to an array that doesn't contain it", () => {
        const standingOrders: IStandingOrders = { id: 123 };
        const standingOrdersCollection: IStandingOrders[] = [{ id: 456 }];
        expectedResult = service.addStandingOrdersToCollectionIfMissing(standingOrdersCollection, standingOrders);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(standingOrders);
      });

      it('should add only unique StandingOrders to an array', () => {
        const standingOrdersArray: IStandingOrders[] = [{ id: 123 }, { id: 456 }, { id: 89225 }];
        const standingOrdersCollection: IStandingOrders[] = [{ id: 123 }];
        expectedResult = service.addStandingOrdersToCollectionIfMissing(standingOrdersCollection, ...standingOrdersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const standingOrders: IStandingOrders = { id: 123 };
        const standingOrders2: IStandingOrders = { id: 456 };
        expectedResult = service.addStandingOrdersToCollectionIfMissing([], standingOrders, standingOrders2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(standingOrders);
        expect(expectedResult).toContain(standingOrders2);
      });

      it('should accept null and undefined values', () => {
        const standingOrders: IStandingOrders = { id: 123 };
        expectedResult = service.addStandingOrdersToCollectionIfMissing([], null, standingOrders, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(standingOrders);
      });

      it('should return initial array if no StandingOrders is added', () => {
        const standingOrdersCollection: IStandingOrders[] = [{ id: 123 }];
        expectedResult = service.addStandingOrdersToCollectionIfMissing(standingOrdersCollection, undefined, null);
        expect(expectedResult).toEqual(standingOrdersCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
