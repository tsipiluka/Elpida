import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StandingOrdersDetailComponent } from './standing-orders-detail.component';

describe('StandingOrders Management Detail Component', () => {
  let comp: StandingOrdersDetailComponent;
  let fixture: ComponentFixture<StandingOrdersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandingOrdersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ standingOrders: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StandingOrdersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StandingOrdersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load standingOrders on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.standingOrders).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
