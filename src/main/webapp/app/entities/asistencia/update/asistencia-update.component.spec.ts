import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AsistenciaService } from '../service/asistencia.service';
import { IAsistencia, Asistencia } from '../asistencia.model';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { AlumnoService } from 'app/entities/alumno/service/alumno.service';
import { ITaller } from 'app/entities/taller/taller.model';
import { TallerService } from 'app/entities/taller/service/taller.service';

import { AsistenciaUpdateComponent } from './asistencia-update.component';

describe('Asistencia Management Update Component', () => {
  let comp: AsistenciaUpdateComponent;
  let fixture: ComponentFixture<AsistenciaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let asistenciaService: AsistenciaService;
  let alumnoService: AlumnoService;
  let tallerService: TallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AsistenciaUpdateComponent],
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
      .overrideTemplate(AsistenciaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AsistenciaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    asistenciaService = TestBed.inject(AsistenciaService);
    alumnoService = TestBed.inject(AlumnoService);
    tallerService = TestBed.inject(TallerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Alumno query and add missing value', () => {
      const asistencia: IAsistencia = { id: 456 };
      const alumno: IAlumno = { id: 15307 };
      asistencia.alumno = alumno;

      const alumnoCollection: IAlumno[] = [{ id: 4357 }];
      jest.spyOn(alumnoService, 'query').mockReturnValue(of(new HttpResponse({ body: alumnoCollection })));
      const additionalAlumnos = [alumno];
      const expectedCollection: IAlumno[] = [...additionalAlumnos, ...alumnoCollection];
      jest.spyOn(alumnoService, 'addAlumnoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ asistencia });
      comp.ngOnInit();

      expect(alumnoService.query).toHaveBeenCalled();
      expect(alumnoService.addAlumnoToCollectionIfMissing).toHaveBeenCalledWith(alumnoCollection, ...additionalAlumnos);
      expect(comp.alumnosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Taller query and add missing value', () => {
      const asistencia: IAsistencia = { id: 456 };
      const taller: ITaller = { id: 25012 };
      asistencia.taller = taller;

      const tallerCollection: ITaller[] = [{ id: 43106 }];
      jest.spyOn(tallerService, 'query').mockReturnValue(of(new HttpResponse({ body: tallerCollection })));
      const additionalTallers = [taller];
      const expectedCollection: ITaller[] = [...additionalTallers, ...tallerCollection];
      jest.spyOn(tallerService, 'addTallerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ asistencia });
      comp.ngOnInit();

      expect(tallerService.query).toHaveBeenCalled();
      expect(tallerService.addTallerToCollectionIfMissing).toHaveBeenCalledWith(tallerCollection, ...additionalTallers);
      expect(comp.tallersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const asistencia: IAsistencia = { id: 456 };
      const alumno: IAlumno = { id: 57350 };
      asistencia.alumno = alumno;
      const taller: ITaller = { id: 22939 };
      asistencia.taller = taller;

      activatedRoute.data = of({ asistencia });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(asistencia));
      expect(comp.alumnosSharedCollection).toContain(alumno);
      expect(comp.tallersSharedCollection).toContain(taller);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asistencia>>();
      const asistencia = { id: 123 };
      jest.spyOn(asistenciaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asistencia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asistencia }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(asistenciaService.update).toHaveBeenCalledWith(asistencia);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asistencia>>();
      const asistencia = new Asistencia();
      jest.spyOn(asistenciaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asistencia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asistencia }));
      saveSubject.complete();

      // THEN
      expect(asistenciaService.create).toHaveBeenCalledWith(asistencia);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asistencia>>();
      const asistencia = { id: 123 };
      jest.spyOn(asistenciaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asistencia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(asistenciaService.update).toHaveBeenCalledWith(asistencia);
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
