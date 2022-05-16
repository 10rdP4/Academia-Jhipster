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
  profesor?:IProfesor = undefined;

  // Datos profesor
  nombre = '';
  apellido = '';
  dni  = '';
  sueldo  = 0;

  constructor(public profesorService: ProfesorService) {
    this.titulo = '';
  }

  ngOnInit(): void {
    this.titulo = '';
  }

  guardar():void {
    const nuevo_profesor:IProfesor = {
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      sueldo: this.sueldo
    }
    this.profesorService.create(nuevo_profesor);
  }

  cancelar():void{
    this.nombre = '';
    this.apellido = '';
    this.dni  = '';
    this.sueldo  = 0;
  }
}
