import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IncomesDetailComponent } from './incomes-detail.component';

describe('Incomes Management Detail Component', () => {
  let comp: IncomesDetailComponent;
  let fixture: ComponentFixture<IncomesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ incomes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IncomesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IncomesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load incomes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.incomes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
