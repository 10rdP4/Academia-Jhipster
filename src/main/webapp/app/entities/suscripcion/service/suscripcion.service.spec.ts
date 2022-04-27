import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISuscripcion, Suscripcion } from '../suscripcion.model';

import { SuscripcionService } from './suscripcion.service';

describe('Suscripcion Service', () => {
  let service: SuscripcionService;
  let httpMock: HttpTestingController;
  let elemDefault: ISuscripcion;
  let expectedResult: ISuscripcion | ISuscripcion[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SuscripcionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fecha: currentDate,
      activa: false,
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

    it('should create a Suscripcion', () => {
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

      service.create(new Suscripcion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Suscripcion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fecha: currentDate.format(DATE_TIME_FORMAT),
          activa: true,
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

    it('should partial update a Suscripcion', () => {
      const patchObject = Object.assign(
        {
          activa: true,
        },
        new Suscripcion()
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

    it('should return a list of Suscripcion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fecha: currentDate.format(DATE_TIME_FORMAT),
          activa: true,
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

    it('should delete a Suscripcion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSuscripcionToCollectionIfMissing', () => {
      it('should add a Suscripcion to an empty array', () => {
        const suscripcion: ISuscripcion = { id: 123 };
        expectedResult = service.addSuscripcionToCollectionIfMissing([], suscripcion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(suscripcion);
      });

      it('should not add a Suscripcion to an array that contains it', () => {
        const suscripcion: ISuscripcion = { id: 123 };
        const suscripcionCollection: ISuscripcion[] = [
          {
            ...suscripcion,
          },
          { id: 456 },
        ];
        expectedResult = service.addSuscripcionToCollectionIfMissing(suscripcionCollection, suscripcion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Suscripcion to an array that doesn't contain it", () => {
        const suscripcion: ISuscripcion = { id: 123 };
        const suscripcionCollection: ISuscripcion[] = [{ id: 456 }];
        expectedResult = service.addSuscripcionToCollectionIfMissing(suscripcionCollection, suscripcion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(suscripcion);
      });

      it('should add only unique Suscripcion to an array', () => {
        const suscripcionArray: ISuscripcion[] = [{ id: 123 }, { id: 456 }, { id: 3841 }];
        const suscripcionCollection: ISuscripcion[] = [{ id: 123 }];
        expectedResult = service.addSuscripcionToCollectionIfMissing(suscripcionCollection, ...suscripcionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const suscripcion: ISuscripcion = { id: 123 };
        const suscripcion2: ISuscripcion = { id: 456 };
        expectedResult = service.addSuscripcionToCollectionIfMissing([], suscripcion, suscripcion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(suscripcion);
        expect(expectedResult).toContain(suscripcion2);
      });

      it('should accept null and undefined values', () => {
        const suscripcion: ISuscripcion = { id: 123 };
        expectedResult = service.addSuscripcionToCollectionIfMissing([], null, suscripcion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(suscripcion);
      });

      it('should return initial array if no Suscripcion is added', () => {
        const suscripcionCollection: ISuscripcion[] = [{ id: 123 }];
        expectedResult = service.addSuscripcionToCollectionIfMissing(suscripcionCollection, undefined, null);
        expect(expectedResult).toEqual(suscripcionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
