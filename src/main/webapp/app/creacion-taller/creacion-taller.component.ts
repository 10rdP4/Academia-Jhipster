import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { IProfesor } from "app/entities/profesor/profesor.model";
import { ProfesorService } from "app/entities/profesor/service/profesor.service";
import { TallerService } from "app/entities/taller/service/taller.service";
import { ITaller } from "app/entities/taller/taller.model";


@Component({
  selector: 'jhi-creacion-taller',
  templateUrl: './creacion-taller.component.html',
  styleUrls: ['./creacion-taller.component.scss'],
})
export class CreacionTallerComponent implements OnInit {
  titulo = '';

  // Datos del taller
  nombre = '';
  descripcion = '';
  precio = 0;
  profesor_seleccionado?: IProfesor = undefined;

  // Lista de profesores existentes
  lista_profesores: IProfesor[] = [];

  // Comprobacion de Errores
  lista_errores: string[] = [];
  busqueda_talleres: ITaller[] = [];

  taller_guardado = false;

  constructor(public profesorService: ProfesorService, public tallerService: TallerService) {
    this.titulo = '';
    this.cargarProfesores();
  }

  ngOnInit(): void {
    this.titulo = '';
  }

  cargarProfesores(): void {
    this.profesorService
      .query({
        size: 30,
      })
      .subscribe({
        next: (profesores: HttpResponse<IProfesor[]>) => {
          this.lista_profesores = profesores.body ?? [];
        }
      });
  }

  comprobacionErrores(): void {
    if (this.nombre === '') {
      this.lista_errores.push("El nombre del taller no puede estar vacio");
    }

    if (this.descripcion === '') {
      this.lista_errores.push("La descripcion del taller no puede estar vacia");
    }

    if (this.precio <= 0) {
      this.lista_errores.push("El precio del taller es incorrecto");
    }

    if (this.profesor_seleccionado === undefined) {
      this.lista_errores.push("Es necesario seleccionar un profesor");
    }

    // Una vez termina de comprobar, creamos el taller
    this.crearTaller();
  }

  seleccionarProfesor(profesor: IProfesor): void {
    this.profesor_seleccionado = profesor;
  }

  vaciarCampos(): void {
    this.nombre = '';
    this.descripcion = '';
    this.precio = 0;
    this.profesor_seleccionado = undefined;

  }

  guardarTaller(): void {
    this.lista_errores = [];
    this.comprobarTaller();
  }

  comprobarTaller(): void {
    if (this.nombre !== '') {
      this.nombre = this.nombre.charAt(0).toUpperCase() + this.nombre.substring(1, this.nombre.length);
      this.tallerService.findByNombre(this.nombre).subscribe({
        next: (talleres: HttpResponse<ITaller[]>) => {
          this.busqueda_talleres = talleres.body ?? [];
          if (this.busqueda_talleres.length > 0) {
            this.lista_errores.push("Ya existe un taller con ese nombre");
          }
          this.comprobacionErrores();
        }
      })
    }
  }

  crearTaller():void{
    if (this.lista_errores.length <= 0) {
      const nuevo_taller: ITaller = {
        nombre: this.nombre.charAt(0).toUpperCase() + this.nombre.substring(1, this.nombre.length),
        descripcion: this.descripcion,
        precio: this.precio,
        profesor: this.profesor_seleccionado
      }
      this.tallerService.create(nuevo_taller).subscribe();
      this.taller_guardado = true;
      this.vaciarCampos();
    }
  }
}
