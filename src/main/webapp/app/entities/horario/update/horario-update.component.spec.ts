import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HorarioService } from '../service/horario.service';
import { IHorario, Horario } from '../horario.model';
import { ITaller } from 'app/entities/taller/taller.model';
import { TallerService } from 'app/entities/taller/service/taller.service';

import { HorarioUpdateComponent } from './horario-update.component';

describe('Horario Management Update Component', () => {
  let comp: HorarioUpdateComponent;
  let fixture: ComponentFixture<HorarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let horarioService: HorarioService;
  let tallerService: TallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HorarioUpdateComponent],
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
      .overrideTemplate(HorarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HorarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    horarioService = TestBed.inject(HorarioService);
    tallerService = TestBed.inject(TallerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Taller query and add missing value', () => {
      const horario: IHorario = { id: 456 };
      const taller: ITaller = { id: 94490 };
      horario.taller = taller;

      const tallerCollection: ITaller[] = [{ id: 76873 }];
      jest.spyOn(tallerService, 'query').mockReturnValue(of(new HttpResponse({ body: tallerCollection })));
      const additionalTallers = [taller];
      const expectedCollection: ITaller[] = [...additionalTallers, ...tallerCollection];
      jest.spyOn(tallerService, 'addTallerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      expect(tallerService.query).toHaveBeenCalled();
      expect(tallerService.addTallerToCollectionIfMissing).toHaveBeenCalledWith(tallerCollection, ...additionalTallers);
      expect(comp.tallersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const horario: IHorario = { id: 456 };
      const taller: ITaller = { id: 97251 };
      horario.taller = taller;

      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(horario));
      expect(comp.tallersSharedCollection).toContain(taller);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Horario>>();
      const horario = { id: 123 };
      jest.spyOn(horarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: horario }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(horarioService.update).toHaveBeenCalledWith(horario);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Horario>>();
      const horario = new Horario();
      jest.spyOn(horarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: horario }));
      saveSubject.complete();

      // THEN
      expect(horarioService.create).toHaveBeenCalledWith(horario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Horario>>();
      const horario = { id: 123 };
      jest.spyOn(horarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(horarioService.update).toHaveBeenCalledWith(horario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTallerById', () => {
      it('Should return tracked Taller primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTallerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
