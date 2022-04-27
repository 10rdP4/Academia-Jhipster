import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ContactoService } from '../service/contacto.service';
import { IContacto, Contacto } from '../contacto.model';

import { ContactoUpdateComponent } from './contacto-update.component';

describe('Contacto Management Update Component', () => {
  let comp: ContactoUpdateComponent;
  let fixture: ComponentFixture<ContactoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contactoService: ContactoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContactoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ContactoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContactoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contactoService = TestBed.inject(ContactoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const contacto: IContacto = { id: 456 };

      activatedRoute.data = of({ contacto });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(contacto));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contacto>>();
      const contacto = { id: 123 };
      jest.spyOn(contactoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contacto }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(contactoService.update).toHaveBeenCalledWith(contacto);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contacto>>();
      const contacto = new Contacto();
      jest.spyOn(contactoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contacto }));
      saveSubject.complete();

      // THEN
      expect(contactoService.create).toHaveBeenCalledWith(contacto);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contacto>>();
      const contacto = { id: 123 };
      jest.spyOn(contactoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contactoService.update).toHaveBeenCalledWith(contacto);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
