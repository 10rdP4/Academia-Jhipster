import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProfesorDetailComponent } from './profesor-detail.component';

describe('Profesor Management Detail Component', () => {
  let comp: ProfesorDetailComponent;
  let fixture: ComponentFixture<ProfesorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ profesor: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProfesorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProfesorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load profesor on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.profesor).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
