import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAsistencia, Asistencia } from '../asistencia.model';

import { AsistenciaService } from './asistencia.service';

describe('Asistencia Service', () => {
  let service: AsistenciaService;
  let httpMock: HttpTestingController;
  let elemDefault: IAsistencia;
  let expectedResult: IAsistencia | IAsistencia[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AsistenciaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fecha: currentDate,
      asistencia: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Asistencia', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.create(new Asistencia()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Asistencia', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fecha: currentDate.format(DATE_TIME_FORMAT),
          asistencia: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Asistencia', () => {
      const patchObject = Object.assign(
        {
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        new Asistencia()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Asistencia', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fecha: currentDate.format(DATE_TIME_FORMAT),
          asistencia: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Asistencia', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAsistenciaToCollectionIfMissing', () => {
      it('should add a Asistencia to an empty array', () => {
        const asistencia: IAsistencia = { id: 123 };
        expectedResult = service.addAsistenciaToCollectionIfMissing([], asistencia);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(asistencia);
      });

      it('should not add a Asistencia to an array that contains it', () => {
        const asistencia: IAsistencia = { id: 123 };
        const asistenciaCollection: IAsistencia[] = [
          {
            ...asistencia,
          },
          { id: 456 },
        ];
        expectedResult = service.addAsistenciaToCollectionIfMissing(asistenciaCollection, asistencia);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Asistencia to an array that doesn't contain it", () => {
        const asistencia: IAsistencia = { id: 123 };
        const asistenciaCollection: IAsistencia[] = [{ id: 456 }];
        expectedResult = service.addAsistenciaToCollectionIfMissing(asistenciaCollection, asistencia);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(asistencia);
      });

      it('should add only unique Asistencia to an array', () => {
        const asistenciaArray: IAsistencia[] = [{ id: 123 }, { id: 456 }, { id: 7713 }];
        const asistenciaCollection: IAsistencia[] = [{ id: 123 }];
        expectedResult = service.addAsistenciaToCollectionIfMissing(asistenciaCollection, ...asistenciaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const asistencia: IAsistencia = { id: 123 };
        const asistencia2: IAsistencia = { id: 456 };
        expectedResult = service.addAsistenciaToCollectionIfMissing([], asistencia, asistencia2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(asistencia);
        expect(expectedResult).toContain(asistencia2);
      });

      it('should accept null and undefined values', () => {
        const asistencia: IAsistencia = { id: 123 };
        expectedResult = service.addAsistenciaToCollectionIfMissing([], null, asistencia, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(asistencia);
      });

      it('should return initial array if no Asistencia is added', () => {
        const asistenciaCollection: IAsistencia[] = [{ id: 123 }];
        expectedResult = service.addAsistenciaToCollectionIfMissing(asistenciaCollection, undefined, null);
        expect(expectedResult).toEqual(asistenciaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
