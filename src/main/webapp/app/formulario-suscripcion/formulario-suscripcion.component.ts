import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';
import { TallerService } from 'app/entities/taller/service/taller.service';
import { ITaller } from 'app/entities/taller/taller.model';
import dayjs from 'dayjs/esm';
import { FormularioSuscripcionService } from './formulario-suscripcion.service';
import { ResumenSuscripcionModalComponent } from './resumen-suscripcion-modal/resumen-suscripcion-modal.component';

@Component({
  selector: 'jhi-formulario-suscripcion',
  templateUrl: './formulario-suscripcion.component.html',
  styleUrls: ['./formulario-suscripcion.component.scss'],
})
export class FormularioSuscripcionComponent implements OnInit {
  titulo = '';

  // alumno
  nombre_alumno = '';
  apellido_alumno = '';
  dni_alumno = '';

  // contacto
  nombre_contacto = '';
  dni_contacto = '';
  telefono_contacto = '';
  correo_contacto = '';

  // taller
  talleres_disponibles: ITaller[] = [];
  taller_seleccionado?: ITaller = undefined;

  // error al rellenar formulario
  error = false;
  lista_errores: string[] = [];

  constructor(public tallerService: TallerService, public horarioService: HorarioService, public formularioSuscripcionService: FormularioSuscripcionService, private modalService: NgbModal) {
    this.titulo = '';

    this.loadTalleres();
  }

  ngOnInit(): void {
    this.titulo = '';
  }

  loadTalleres(): void {
    this.tallerService
      .query({
        size: 50,
      })
      .subscribe({
        next: (res: HttpResponse<ITaller[]>) => {
          this.talleres_disponibles = res.body ?? [];
        },
      });
  }

  seleccionarTaller(taller: ITaller): void {
    this.taller_seleccionado = taller;

    // Cargamos los horarios de ese taller
    this.horarioService.findHorarioByTaller(this.taller_seleccionado.id!).subscribe({
      next: (res: HttpResponse<IHorario[]>) => {
        this.taller_seleccionado!.horarios = res.body ?? [];
      },
    });
  }

  formatoHorario(horario: IHorario): string {
    let dia_semana = '';

    switch (horario.diaSemana) {
      case 0:
        dia_semana = 'Lunes';
        break;
      case 1:
        dia_semana = 'Martes';
        break;
      case 2:
        dia_semana = 'Miercoles';
        break;
      case 3:
        dia_semana = 'Jueves';
        break;
      case 4:
        dia_semana = 'Viernes';
        break;
      case 5:
        dia_semana = 'Sábado';
        break;
      case 6:
        dia_semana = 'Domingo';
        break;

      default:
        dia_semana = 'Error';
        break;
    }

    return `${dia_semana} - ${horario.horaInicioTaller!}`;
  }

  vaciarCampos(): void {
    this.nombre_alumno = '';
    this.apellido_alumno = '';
    this.dni_alumno = '';
    this.nombre_contacto = '';
    this.dni_contacto = '';
    this.telefono_contacto = '';
    this.correo_contacto = '';
    this.taller_seleccionado = undefined;
  }

  resumenSuscripcion(): void {
    if (!this.comprobacionErrores()) {
      this.cargaDatos();
      this.modalService.open(ResumenSuscripcionModalComponent);
    }
  }

  comprobacionErrores(): boolean {
    this.lista_errores = [];

    if (this.nombre_alumno === '') {
      this.lista_errores.push("Nombre del alumno no puede estar vacio")
    }

    if (this.apellido_alumno === '') {
      this.lista_errores.push("Apellido del alumno no puede estar vacio")
    }

    if (this.dni_alumno === '') {
      this.lista_errores.push("DNI del alumno no puede estar vacio")
    }

    if (this.nombre_contacto === '') {
      this.lista_errores.push("Nombre del contacto no puede estar vacio")
    }

    if (this.dni_contacto === '') {
      this.lista_errores.push("DNI del contacto no puede estar vacio")
    }

    if (this.telefono_contacto.length !== 9 && this.telefono_contacto.length > 0) {
      this.lista_errores.push("Telefono Incorrecto")
    }

    if (this.telefono_contacto === '' && this.correo_contacto === '') {
      this.lista_errores.push("Al menos hay que facilitar un correo o un telefono de contacto")
    }

    if (this.taller_seleccionado === undefined) {
      this.lista_errores.push("No se ha seleccionado ningún taller");
    }

    return (this.error = this.lista_errores.length > 0);
  }

  cargaDatos():void {
    this.formularioSuscripcionService.setNombreAlumno(this.nombre_alumno);
    this.formularioSuscripcionService.setApellidoAlumno(this.apellido_alumno);
    this.formularioSuscripcionService.setDniAlumno(this.dni_alumno);
    this.formularioSuscripcionService.setNombreContacto(this.nombre_contacto);
    this.formularioSuscripcionService.setDniContacto(this.dni_contacto);
    this.formularioSuscripcionService.setTelefonoContacto(this.telefono_contacto);
    this.formularioSuscripcionService.setCorreoContacto(this.correo_contacto);
    this.formularioSuscripcionService.setTaller(this.taller_seleccionado!);
    this.formularioSuscripcionService.setFecha(dayjs());
  }
}
