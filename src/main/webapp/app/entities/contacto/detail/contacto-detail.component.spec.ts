import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ContactoDetailComponent } from './contacto-detail.component';

describe('Contacto Management Detail Component', () => {
  let comp: ContactoDetailComponent;
  let fixture: ComponentFixture<ContactoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ contacto: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ContactoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ContactoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load contacto on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.contacto).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
