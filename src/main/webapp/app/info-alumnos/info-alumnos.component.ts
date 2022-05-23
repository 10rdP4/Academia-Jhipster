import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { IAlumno } from "app/entities/alumno/alumno.model";
import { AlumnoService } from "app/entities/alumno/service/alumno.service";
import { IContacto } from "app/entities/contacto/contacto.model";
import { ContactoService } from "app/entities/contacto/service/contacto.service";
import { SuscripcionService } from "app/entities/suscripcion/service/suscripcion.service";
import { ISuscripcion } from "app/entities/suscripcion/suscripcion.model";
import dayjs from "dayjs/esm";

@Component({
  selector: 'jhi-horario-semanal',
  templateUrl: './info-alumnos.component.html',
  styleUrls: ['./info-alumnos.component.scss'],
})
export class InfoAlumnosComponent implements OnInit {
  titulo = '';
  alumno_busqueda = '';
  alumno_seleccionado?: IAlumno = undefined;
  alumnos_registrados: IAlumno[] = [];
  alumno_contacto:IContacto = {};
  alumno_suscripciones:ISuscripcion[] = [];

  constructor(
      public alumnoService:AlumnoService,
      public contactoService:ContactoService,
      public suscripcionService:SuscripcionService
  ) {
    this.titulo = 'info alumno';
  }

  ngOnInit(): void {
    this.titulo = '';
  }

  seleccionarAlumnoExistente(alumno: IAlumno): void {
    this.alumno_seleccionado = alumno;
    this.alumnos_registrados = [this.alumno_seleccionado];
    this.alumno_busqueda = '';

    this.buscarSuscripcion();
  }

  buscarAlumno(): void {
    this.alumnoService.buscarAlumno(this.alumno_busqueda).subscribe({
      next: (res: HttpResponse<IAlumno[]>) => {
        this.alumnos_registrados = res.body ?? [];
      },
      error: () => {
        this.alumnos_registrados = [];
      },
    });
  }

  buscarSuscripcion():void{
    this.suscripcionService.buscarSucripcionPorAlumno(this.alumno_seleccionado!.id!).subscribe({
        next: (resp: HttpResponse<ISuscripcion[]>) => {
            this.alumno_suscripciones = resp.body ?? [];
        }
    });
  }

  formatearFecha(suscripcion: ISuscripcion):string{
    return dayjs(suscripcion.fecha).format("DD/MM/YYYY");
  }
}
