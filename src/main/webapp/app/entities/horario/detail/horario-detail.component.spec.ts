import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HorarioDetailComponent } from './horario-detail.component';

describe('Horario Management Detail Component', () => {
  let comp: HorarioDetailComponent;
  let fixture: ComponentFixture<HorarioDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorarioDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ horario: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HorarioDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HorarioDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load horario on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.horario).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
