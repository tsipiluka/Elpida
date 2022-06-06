import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IncomesService } from '../service/incomes.service';
import { IIncomes, Incomes } from '../incomes.model';

import { IncomesUpdateComponent } from './incomes-update.component';

describe('Incomes Management Update Component', () => {
  let comp: IncomesUpdateComponent;
  let fixture: ComponentFixture<IncomesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let incomesService: IncomesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IncomesUpdateComponent],
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
      .overrideTemplate(IncomesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IncomesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    incomesService = TestBed.inject(IncomesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const incomes: IIncomes = { id: 456 };

      activatedRoute.data = of({ incomes });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(incomes));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Incomes>>();
      const incomes = { id: 123 };
      jest.spyOn(incomesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ incomes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: incomes }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(incomesService.update).toHaveBeenCalledWith(incomes);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Incomes>>();
      const incomes = new Incomes();
      jest.spyOn(incomesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ incomes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: incomes }));
      saveSubject.complete();

      // THEN
      expect(incomesService.create).toHaveBeenCalledWith(incomes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Incomes>>();
      const incomes = { id: 123 };
      jest.spyOn(incomesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ incomes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(incomesService.update).toHaveBeenCalledWith(incomes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
