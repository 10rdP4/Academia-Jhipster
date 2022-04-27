import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SuscripcionDetailComponent } from './suscripcion-detail.component';

describe('Suscripcion Management Detail Component', () => {
  let comp: SuscripcionDetailComponent;
  let fixture: ComponentFixture<SuscripcionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuscripcionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ suscripcion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SuscripcionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SuscripcionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load suscripcion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.suscripcion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
