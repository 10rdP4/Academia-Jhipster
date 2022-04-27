import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TallerDetailComponent } from './taller-detail.component';

describe('Taller Management Detail Component', () => {
  let comp: TallerDetailComponent;
  let fixture: ComponentFixture<TallerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TallerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ taller: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TallerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TallerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load taller on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.taller).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
