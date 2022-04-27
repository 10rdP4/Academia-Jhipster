import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AlumnoDetailComponent } from './alumno-detail.component';

describe('Alumno Management Detail Component', () => {
  let comp: AlumnoDetailComponent;
  let fixture: ComponentFixture<AlumnoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlumnoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ alumno: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AlumnoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AlumnoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load alumno on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.alumno).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
