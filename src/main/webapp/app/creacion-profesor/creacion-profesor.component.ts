import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { IProfesor } from "app/entities/profesor/profesor.model";
import { ProfesorService } from "app/entities/profesor/service/profesor.service";


@Component({
  selector: 'jhi-creacion-profesor',
  templateUrl: './creacion-profesor.component.html',
  styleUrls: ['./creacion-profesor.component.scss'],
})
export class CreacionProfesorComponent implements OnInit {
  titulo = '';
  profesor?: IProfesor = undefined;

  // Datos profesor
  nombre = '';
  apellido = '';
  dni = '';
  sueldo = 0;

  // Errores
  lista_errores: string[] = [];
  busqueda_profesor: IProfesor[] = [];

  constructor(public profesorService: ProfesorService) {
    this.titulo = '';
  }

  ngOnInit(): void {
    this.titulo = '';
  }

  guardar(): void {
    this.lista_errores = [];
    this.buscarProfesor();
  }

  cancelar(): void {
    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.sueldo = 0;
  }

  comprobarErrores(): void {
    if (this.nombre === '') {
      this.lista_errores.push("El nombre del profesor no puede estar vacío");
    }
    if (this.apellido === '') {
      this.lista_errores.push("El apellido del profesor no puede estar vacío");
    }
    if (this.dni === '') {
      this.lista_errores.push("El dni del profesor no puede estar vacío");
    }
    if (this.sueldo <= 0) {
      this.lista_errores.push("Error en el sueldo del profesor");
    }

    // Si no hay errores se crea el profesor
    this.crearProfesor();
  }

  buscarProfesor(): void {
    this.profesorService.findProfesorByDni(this.dni).subscribe({
      next: (profesores: HttpResponse<IProfesor[]>) => {
        this.busqueda_profesor = profesores.body ?? [];
        if (this.busqueda_profesor.length > 0) {
          this.lista_errores.push("Ya existe un profesor con ese DNI");
        }
        this.comprobarErrores();
      }
    });
  }

  crearProfesor():void{
    if (this.lista_errores.length <= 0) {
      const nuevo_profesor: IProfesor = {
        nombre: this.nombre,
        apellido: this.apellido,
        dni: this.dni,
        sueldo: this.sueldo
      }
      this.profesorService.create(nuevo_profesor).subscribe();
    }
  }
}
