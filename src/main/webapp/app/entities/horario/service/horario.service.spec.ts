import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHorario, Horario } from '../horario.model';

import { HorarioService } from './horario.service';

describe('Horario Service', () => {
  let service: HorarioService;
  let httpMock: HttpTestingController;
  let elemDefault: IHorario;
  let expectedResult: IHorario | IHorario[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HorarioService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      diaSemana: 0,
      horaInicioTaller: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Horario', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Horario()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Horario', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          diaSemana: 1,
          horaInicioTaller: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Horario', () => {
      const patchObject = Object.assign(
        {
          horaInicioTaller: 'BBBBBB',
        },
        new Horario()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Horario', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          diaSemana: 1,
          horaInicioTaller: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Horario', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHorarioToCollectionIfMissing', () => {
      it('should add a Horario to an empty array', () => {
        const horario: IHorario = { id: 123 };
        expectedResult = service.addHorarioToCollectionIfMissing([], horario);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(horario);
      });

      it('should not add a Horario to an array that contains it', () => {
        const horario: IHorario = { id: 123 };
        const horarioCollection: IHorario[] = [
          {
            ...horario,
          },
          { id: 456 },
        ];
        expectedResult = service.addHorarioToCollectionIfMissing(horarioCollection, horario);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Horario to an array that doesn't contain it", () => {
        const horario: IHorario = { id: 123 };
        const horarioCollection: IHorario[] = [{ id: 456 }];
        expectedResult = service.addHorarioToCollectionIfMissing(horarioCollection, horario);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(horario);
      });

      it('should add only unique Horario to an array', () => {
        const horarioArray: IHorario[] = [{ id: 123 }, { id: 456 }, { id: 21860 }];
        const horarioCollection: IHorario[] = [{ id: 123 }];
        expectedResult = service.addHorarioToCollectionIfMissing(horarioCollection, ...horarioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const horario: IHorario = { id: 123 };
        const horario2: IHorario = { id: 456 };
        expectedResult = service.addHorarioToCollectionIfMissing([], horario, horario2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(horario);
        expect(expectedResult).toContain(horario2);
      });

      it('should accept null and undefined values', () => {
        const horario: IHorario = { id: 123 };
        expectedResult = service.addHorarioToCollectionIfMissing([], null, horario, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(horario);
      });

      it('should return initial array if no Horario is added', () => {
        const horarioCollection: IHorario[] = [{ id: 123 }];
        expectedResult = service.addHorarioToCollectionIfMissing(horarioCollection, undefined, null);
        expect(expectedResult).toEqual(horarioCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
