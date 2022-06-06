import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IStandingOrders, StandingOrders } from '../standing-orders.model';
import { StandingOrdersService } from '../service/standing-orders.service';

import { StandingOrdersRoutingResolveService } from './standing-orders-routing-resolve.service';

describe('StandingOrders routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: StandingOrdersRoutingResolveService;
  let service: StandingOrdersService;
  let resultStandingOrders: IStandingOrders | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(StandingOrdersRoutingResolveService);
    service = TestBed.inject(StandingOrdersService);
    resultStandingOrders = undefined;
  });

  describe('resolve', () => {
    it('should return IStandingOrders returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStandingOrders = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultStandingOrders).toEqual({ id: 123 });
    });

    it('should return new IStandingOrders if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStandingOrders = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultStandingOrders).toEqual(new StandingOrders());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as StandingOrders })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStandingOrders = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultStandingOrders).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
