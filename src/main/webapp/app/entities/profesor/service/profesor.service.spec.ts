import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProfesor, Profesor } from '../profesor.model';

import { ProfesorService } from './profesor.service';

describe('Profesor Service', () => {
  let service: ProfesorService;
  let httpMock: HttpTestingController;
  let elemDefault: IProfesor;
  let expectedResult: IProfesor | IProfesor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProfesorService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombre: 'AAAAAAA',
      apellido: 'AAAAAAA',
      sueldo: 0,
      dni: 'AAAAAAA',
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

    it('should create a Profesor', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Profesor()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Profesor', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
          apellido: 'BBBBBB',
          sueldo: 1,
          dni: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Profesor', () => {
      const patchObject = Object.assign(
        {
          nombre: 'BBBBBB',
          sueldo: 1,
        },
        new Profesor()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Profesor', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
          apellido: 'BBBBBB',
          sueldo: 1,
          dni: 'BBBBBB',
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

    it('should delete a Profesor', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProfesorToCollectionIfMissing', () => {
      it('should add a Profesor to an empty array', () => {
        const profesor: IProfesor = { id: 123 };
        expectedResult = service.addProfesorToCollectionIfMissing([], profesor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profesor);
      });

      it('should not add a Profesor to an array that contains it', () => {
        const profesor: IProfesor = { id: 123 };
        const profesorCollection: IProfesor[] = [
          {
            ...profesor,
          },
          { id: 456 },
        ];
        expectedResult = service.addProfesorToCollectionIfMissing(profesorCollection, profesor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Profesor to an array that doesn't contain it", () => {
        const profesor: IProfesor = { id: 123 };
        const profesorCollection: IProfesor[] = [{ id: 456 }];
        expectedResult = service.addProfesorToCollectionIfMissing(profesorCollection, profesor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profesor);
      });

      it('should add only unique Profesor to an array', () => {
        const profesorArray: IProfesor[] = [{ id: 123 }, { id: 456 }, { id: 32371 }];
        const profesorCollection: IProfesor[] = [{ id: 123 }];
        expectedResult = service.addProfesorToCollectionIfMissing(profesorCollection, ...profesorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const profesor: IProfesor = { id: 123 };
        const profesor2: IProfesor = { id: 456 };
        expectedResult = service.addProfesorToCollectionIfMissing([], profesor, profesor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profesor);
        expect(expectedResult).toContain(profesor2);
      });

      it('should accept null and undefined values', () => {
        const profesor: IProfesor = { id: 123 };
        expectedResult = service.addProfesorToCollectionIfMissing([], null, profesor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profesor);
      });

      it('should return initial array if no Profesor is added', () => {
        const profesorCollection: IProfesor[] = [{ id: 123 }];
        expectedResult = service.addProfesorToCollectionIfMissing(profesorCollection, undefined, null);
        expect(expectedResult).toEqual(profesorCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
