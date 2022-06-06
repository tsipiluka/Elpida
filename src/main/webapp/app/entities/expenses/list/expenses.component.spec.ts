import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ExpensesService } from '../service/expenses.service';

import { ExpensesComponent } from './expenses.component';

describe('Expenses Management Component', () => {
  let comp: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;
  let service: ExpensesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ExpensesComponent],
    })
      .overrideTemplate(ExpensesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExpensesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExpensesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.expenses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
