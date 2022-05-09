import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { AlumnoService } from 'app/entities/alumno/service/alumno.service';
import { IContacto } from 'app/entities/contacto/contacto.model';
import { ContactoService } from 'app/entities/contacto/service/contacto.service';
import { SuscripcionService } from 'app/entities/suscripcion/service/suscripcion.service';
import { ISuscripcion } from 'app/entities/suscripcion/suscripcion.model';
import dayjs from 'dayjs';
import { FormularioSuscripcionService } from '../formulario-suscripcion.service';

@Component({
  selector: 'jhi-resumen-suscripcion-modal',
  templateUrl: "./resumen-suscripcion-modal.component.html"
})
export class ResumenSuscripcionModalComponent {

  suscripcion: ISuscripcion = {};

  // Para crear los componente
  contacto_recibido?: IContacto;
  alumno_recibido?: IAlumno;

  // Se crean o no los componentes
  crear_contacto = false;
  crear_alumno = false;

  constructor(
    public activeModal: NgbActiveModal,
    public formularioSuscripcionService: FormularioSuscripcionService,
    public suscripcionService: SuscripcionService,
    public contactoService: ContactoService,
    public alumnoService: AlumnoService
  ) {
    this.suscripcion = formularioSuscripcionService.nuevaSuscripcion;
  }

  guardarSuscripcion(): void {

    if (this.crear_alumno) {
      if (this.crear_contacto) {
        this.crearTodo();
      } else {
        this.guardarAlumno();
      }
    } else {
      this.suscripcionService.create(this.formularioSuscripcionService.nuevaSuscripcion).subscribe({
      });
    }
    this.activeModal.close('Close click');
  }

  crearTodo(): void {
    this.contactoService.create(this.formularioSuscripcionService.nuevaSuscripcion.alumno!.contacto!).subscribe({
      next: (contacto: HttpResponse<IContacto>) => {
        this.contacto_recibido = contacto.body ?? undefined;
        this.formularioSuscripcionService.setContactoAlumno(this.contacto_recibido!);
        this.guardarAlumno();
      }
    });
  }

  guardarAlumno(): void {
    this.alumnoService.create(this.formularioSuscripcionService.nuevaSuscripcion.alumno!).subscribe({
      next: (alumno: HttpResponse<IAlumno>) => {
        this.alumno_recibido = alumno.body ?? undefined;
        this.formularioSuscripcionService.setAlumno(this.alumno_recibido!);

        this.suscripcionService.create(this.formularioSuscripcionService.nuevaSuscripcion).subscribe({
        });
      }
    }
    );
  }

  formatFecha():string{
    return dayjs(this.suscripcion.fecha).format('DD/MM/YYYY');
  }
}