import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProfesorService } from '../service/profesor.service';
import { IProfesor, Profesor } from '../profesor.model';

import { ProfesorUpdateComponent } from './profesor-update.component';

describe('Profesor Management Update Component', () => {
  let comp: ProfesorUpdateComponent;
  let fixture: ComponentFixture<ProfesorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let profesorService: ProfesorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProfesorUpdateComponent],
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
      .overrideTemplate(ProfesorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfesorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    profesorService = TestBed.inject(ProfesorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const profesor: IProfesor = { id: 456 };

      activatedRoute.data = of({ profesor });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(profesor));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profesor>>();
      const profesor = { id: 123 };
      jest.spyOn(profesorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profesor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profesor }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(profesorService.update).toHaveBeenCalledWith(profesor);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profesor>>();
      const profesor = new Profesor();
      jest.spyOn(profesorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profesor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profesor }));
      saveSubject.complete();

      // THEN
      expect(profesorService.create).toHaveBeenCalledWith(profesor);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profesor>>();
      const profesor = { id: 123 };
      jest.spyOn(profesorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profesor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(profesorService.update).toHaveBeenCalledWith(profesor);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
