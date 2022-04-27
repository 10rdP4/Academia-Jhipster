import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AsistenciaDetailComponent } from './asistencia-detail.component';

describe('Asistencia Management Detail Component', () => {
  let comp: AsistenciaDetailComponent;
  let fixture: ComponentFixture<AsistenciaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsistenciaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ asistencia: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AsistenciaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AsistenciaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load asistencia on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.asistencia).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
