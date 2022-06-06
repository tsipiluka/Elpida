import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StandingOrdersService } from '../service/standing-orders.service';
import { IStandingOrders, StandingOrders } from '../standing-orders.model';

import { StandingOrdersUpdateComponent } from './standing-orders-update.component';

describe('StandingOrders Management Update Component', () => {
  let comp: StandingOrdersUpdateComponent;
  let fixture: ComponentFixture<StandingOrdersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let standingOrdersService: StandingOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StandingOrdersUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(StandingOrdersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StandingOrdersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    standingOrdersService = TestBed.inject(StandingOrdersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const standingOrders: IStandingOrders = { id: 456 };

      activatedRoute.data = of({ standingOrders });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(standingOrders));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StandingOrders>>();
      const standingOrders = { id: 123 };
      jest.spyOn(standingOrdersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ standingOrders });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: standingOrders }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(standingOrdersService.update).toHaveBeenCalledWith(standingOrders);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StandingOrders>>();
      const standingOrders = new StandingOrders();
      jest.spyOn(standingOrdersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ standingOrders });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: standingOrders }));
      saveSubject.complete();

      // THEN
      expect(standingOrdersService.create).toHaveBeenCalledWith(standingOrders);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StandingOrders>>();
      const standingOrders = { id: 123 };
      jest.spyOn(standingOrdersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ standingOrders });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(standingOrdersService.update).toHaveBeenCalledWith(standingOrders);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
