import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AlumnoService } from '../service/alumno.service';
import { IAlumno, Alumno } from '../alumno.model';
import { IContacto } from 'app/entities/contacto/contacto.model';
import { ContactoService } from 'app/entities/contacto/service/contacto.service';

import { AlumnoUpdateComponent } from './alumno-update.component';

describe('Alumno Management Update Component', () => {
  let comp: AlumnoUpdateComponent;
  let fixture: ComponentFixture<AlumnoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let alumnoService: AlumnoService;
  let contactoService: ContactoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AlumnoUpdateComponent],
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
      .overrideTemplate(AlumnoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlumnoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    alumnoService = TestBed.inject(AlumnoService);
    contactoService = TestBed.inject(ContactoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Contacto query and add missing value', () => {
      const alumno: IAlumno = { id: 456 };
      const contacto: IContacto = { id: 47760 };
      alumno.contacto = contacto;

      const contactoCollection: IContacto[] = [{ id: 67650 }];
      jest.spyOn(contactoService, 'query').mockReturnValue(of(new HttpResponse({ body: contactoCollection })));
      const additionalContactos = [contacto];
      const expectedCollection: IContacto[] = [...additionalContactos, ...contactoCollection];
      jest.spyOn(contactoService, 'addContactoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      expect(contactoService.query).toHaveBeenCalled();
      expect(contactoService.addContactoToCollectionIfMissing).toHaveBeenCalledWith(contactoCollection, ...additionalContactos);
      expect(comp.contactosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const alumno: IAlumno = { id: 456 };
      const contacto: IContacto = { id: 42912 };
      alumno.contacto = contacto;

      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(alumno));
      expect(comp.contactosSharedCollection).toContain(contacto);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Alumno>>();
      const alumno = { id: 123 };
      jest.spyOn(alumnoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: alumno }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(alumnoService.update).toHaveBeenCalledWith(alumno);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Alumno>>();
      const alumno = new Alumno();
      jest.spyOn(alumnoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: alumno }));
      saveSubject.complete();

      // THEN
      expect(alumnoService.create).toHaveBeenCalledWith(alumno);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Alumno>>();
      const alumno = { id: 123 };
      jest.spyOn(alumnoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(alumnoService.update).toHaveBeenCalledWith(alumno);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackContactoById', () => {
      it('Should return tracked Contacto primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackContactoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
