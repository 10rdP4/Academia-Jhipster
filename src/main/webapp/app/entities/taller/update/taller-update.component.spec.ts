import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TallerService } from '../service/taller.service';
import { ITaller, Taller } from '../taller.model';
import { IProfesor } from 'app/entities/profesor/profesor.model';
import { ProfesorService } from 'app/entities/profesor/service/profesor.service';

import { TallerUpdateComponent } from './taller-update.component';

describe('Taller Management Update Component', () => {
  let comp: TallerUpdateComponent;
  let fixture: ComponentFixture<TallerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tallerService: TallerService;
  let profesorService: ProfesorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TallerUpdateComponent],
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
      .overrideTemplate(TallerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TallerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tallerService = TestBed.inject(TallerService);
    profesorService = TestBed.inject(ProfesorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Profesor query and add missing value', () => {
      const taller: ITaller = { id: 456 };
      const profesor: IProfesor = { id: 38303 };
      taller.profesor = profesor;

      const profesorCollection: IProfesor[] = [{ id: 38146 }];
      jest.spyOn(profesorService, 'query').mockReturnValue(of(new HttpResponse({ body: profesorCollection })));
      const additionalProfesors = [profesor];
      const expectedCollection: IProfesor[] = [...additionalProfesors, ...profesorCollection];
      jest.spyOn(profesorService, 'addProfesorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ taller });
      comp.ngOnInit();

      expect(profesorService.query).toHaveBeenCalled();
      expect(profesorService.addProfesorToCollectionIfMissing).toHaveBeenCalledWith(profesorCollection, ...additionalProfesors);
      expect(comp.profesorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const taller: ITaller = { id: 456 };
      const profesor: IProfesor = { id: 4682 };
      taller.profesor = profesor;

      activatedRoute.data = of({ taller });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(taller));
      expect(comp.profesorsSharedCollection).toContain(profesor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Taller>>();
      const taller = { id: 123 };
      jest.spyOn(tallerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taller });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taller }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(tallerService.update).toHaveBeenCalledWith(taller);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Taller>>();
      const taller = new Taller();
      jest.spyOn(tallerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taller });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taller }));
      saveSubject.complete();

      // THEN
      expect(tallerService.create).toHaveBeenCalledWith(taller);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Taller>>();
      const taller = { id: 123 };
      jest.spyOn(tallerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taller });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tallerService.update).toHaveBeenCalledWith(taller);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProfesorById', () => {
      it('Should return tracked Profesor primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProfesorById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
