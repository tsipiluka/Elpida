import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { IncomesService } from '../service/incomes.service';

import { IncomesComponent } from './incomes.component';

describe('Incomes Management Component', () => {
  let comp: IncomesComponent;
  let fixture: ComponentFixture<IncomesComponent>;
  let service: IncomesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IncomesComponent],
    })
      .overrideTemplate(IncomesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IncomesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IncomesService);

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
    expect(comp.incomes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
