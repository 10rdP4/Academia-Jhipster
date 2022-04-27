import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SuscripcionService } from '../service/suscripcion.service';
import { ISuscripcion, Suscripcion } from '../suscripcion.model';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { AlumnoService } from 'app/entities/alumno/service/alumno.service';
import { ITaller } from 'app/entities/taller/taller.model';
import { TallerService } from 'app/entities/taller/service/taller.service';

import { SuscripcionUpdateComponent } from './suscripcion-update.component';

describe('Suscripcion Management Update Component', () => {
  let comp: SuscripcionUpdateComponent;
  let fixture: ComponentFixture<SuscripcionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let suscripcionService: SuscripcionService;
  let alumnoService: AlumnoService;
  let tallerService: TallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SuscripcionUpdateComponent],
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
      .overrideTemplate(SuscripcionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SuscripcionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    suscripcionService = TestBed.inject(SuscripcionService);
    alumnoService = TestBed.inject(AlumnoService);
    tallerService = TestBed.inject(TallerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Alumno query and add missing value', () => {
      const suscripcion: ISuscripcion = { id: 456 };
      const alumno: IAlumno = { id: 89468 };
      suscripcion.alumno = alumno;

      const alumnoCollection: IAlumno[] = [{ id: 89102 }];
      jest.spyOn(alumnoService, 'query').mockReturnValue(of(new HttpResponse({ body: alumnoCollection })));
      const additionalAlumnos = [alumno];
      const expectedCollection: IAlumno[] = [...additionalAlumnos, ...alumnoCollection];
      jest.spyOn(alumnoService, 'addAlumnoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ suscripcion });
      comp.ngOnInit();

      expect(alumnoService.query).toHaveBeenCalled();
      expect(alumnoService.addAlumnoToCollectionIfMissing).toHaveBeenCalledWith(alumnoCollection, ...additionalAlumnos);
      expect(comp.alumnosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Taller query and add missing value', () => {
      const suscripcion: ISuscripcion = { id: 456 };
      const taller: ITaller = { id: 65500 };
      suscripcion.taller = taller;

      const tallerCollection: ITaller[] = [{ id: 11103 }];
      jest.spyOn(tallerService, 'query').mockReturnValue(of(new HttpResponse({ body: tallerCollection })));
      const additionalTallers = [taller];
      const expectedCollection: ITaller[] = [...additionalTallers, ...tallerCollection];
      jest.spyOn(tallerService, 'addTallerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ suscripcion });
      comp.ngOnInit();

      expect(tallerService.query).toHaveBeenCalled();
      expect(tallerService.addTallerToCollectionIfMissing).toHaveBeenCalledWith(tallerCollection, ...additionalTallers);
      expect(comp.tallersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const suscripcion: ISuscripcion = { id: 456 };
      const alumno: IAlumno = { id: 74632 };
      suscripcion.alumno = alumno;
      const taller: ITaller = { id: 6956 };
      suscripcion.taller = taller;

      activatedRoute.data = of({ suscripcion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(suscripcion));
      expect(comp.alumnosSharedCollection).toContain(alumno);
      expect(comp.tallersSharedCollection).toContain(taller);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Suscripcion>>();
      const suscripcion = { id: 123 };
      jest.spyOn(suscripcionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ suscripcion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: suscripcion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(suscripcionService.update).toHaveBeenCalledWith(suscripcion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Suscripcion>>();
      const suscripcion = new Suscripcion();
      jest.spyOn(suscripcionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ suscripcion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: suscripcion }));
      saveSubject.complete();

      // THEN
      expect(suscripcionService.create).toHaveBeenCalledWith(suscripcion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Suscripcion>>();
      const suscripcion = { id: 123 };
      jest.spyOn(suscripcionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ suscripcion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(suscripcionService.update).toHaveBeenCalledWith(suscripcion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAlumnoById', () => {
      it('Should return tracked Alumno primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAlumnoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTallerById', () => {
      it('Should return tracked Taller primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTallerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
