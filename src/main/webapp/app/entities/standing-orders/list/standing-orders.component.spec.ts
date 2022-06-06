import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StandingOrdersService } from '../service/standing-orders.service';

import { StandingOrdersComponent } from './standing-orders.component';

describe('StandingOrders Management Component', () => {
  let comp: StandingOrdersComponent;
  let fixture: ComponentFixture<StandingOrdersComponent>;
  let service: StandingOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StandingOrdersComponent],
    })
      .overrideTemplate(StandingOrdersComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StandingOrdersComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StandingOrdersService);

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
    expect(comp.standingOrders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
