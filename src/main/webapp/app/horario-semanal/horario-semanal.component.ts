import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ITaller } from 'app/entities/taller/taller.model';
import { TallerService } from 'app/entities/taller/service/taller.service';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HorarioInfoModalComponent } from './horario-info-modal/horario-info-modal.component';
import { HorarioSemanalService } from './horario-semanal.service';

@Component({
  selector: 'jhi-horario-semanal',
  templateUrl: './horario-semanal.component.html',
  styleUrls: ['./horario-semanal.component.scss'],
})
export class HorarioSemanalComponent implements OnInit {
  titulo = '';

  talleres_disponibles: ITaller[] = [];
  taller_seleccionado?: ITaller;
  horario_semanal: IHorario[] = [];
  accion_seleccionada = 'inf-td';
  hora_minima = 9;

  constructor(
    public tallerService: TallerService,
    public horarioService: HorarioService,
    public horarioSemanalService: HorarioSemanalService,
    public modalService: NgbModal
  ) {
    this.titulo = 'Horario semanal';
    this.loadTalleres();
    this.loadHorarios();
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

  loadHorarios(): void {
    this.horarioService
      .query({
        size: 50,
      })
      .subscribe({
        next: (res: HttpResponse<IHorario[]>) => {
          this.horario_semanal = res.body ?? [];
        },
      });
  }

  buscarTallerString(dia: number, hora: number): string {
    const hora_string = hora.toString();
    let taller: ITaller = {};

    this.horario_semanal.forEach(horario => {
      if (horario.diaSemana === dia && horario.horaInicioTaller?.split(':')[0] === hora_string) {
        taller = horario.taller!;
      }
    });

    return taller.nombre === undefined ? ' ' : `${taller.nombre.substring(0, 6)}...`;
  }

  buscarHorario(dia: number, hora: number): IHorario {
    const hora_string = hora.toString();
    let horario_busqueda: IHorario = {};

    this.horario_semanal.forEach(horario => {
      if (horario.diaSemana === dia && horario.horaInicioTaller?.split(':')[0] === hora_string) {
        horario_busqueda = horario;
      }
    });

    return horario_busqueda;
  }

  seleccionarAccion(accion: string, taller?: ITaller): void {
    if (taller !== undefined) {
      this.taller_seleccionado = taller;
    } else {
      this.taller_seleccionado = undefined;
    }
    this.accion_seleccionada = accion;
  }

  accionTd(dia: number, hora: number): void {
    const horario_dummy: IHorario = {
      id: undefined,
      diaSemana: dia,
      taller: this.taller_seleccionado,
      horaInicioTaller: `${hora}:00`,
    };
    const horario_busquea = this.buscarHorario(dia, hora);
    const horario = horario_busquea.id !== undefined ? horario_busquea : horario_dummy;

    switch (this.accion_seleccionada) {
      case 'inf-td':
        if (horario.id !== undefined) {
          this.horarioService.findHorarioByTaller(horario.taller!.id!).subscribe({
            next: (res: HttpResponse<IHorario[]>) => {
              this.horarioSemanalService.setHorarioTaller(res.body ?? []);
              this.horarioSemanalService.setTaller(horario_busquea.taller!);
              this.modalService.open(HorarioInfoModalComponent);
            },
          });
        }
        break;

      case 'mod-td':
        if (horario.id !== undefined) {
          horario.taller = this.taller_seleccionado;
          this.horarioService.update(horario).subscribe({});
        } else {
          this.horarioService.create(horario).subscribe({});
        }
        this.loadHorarios();
        this.refresh();
        break;

      case 'del-td':
        if (horario.id !== undefined) {
          this.horarioService.delete(horario.id).subscribe({});
        } else {
          alert('No se pudo borrar');
        }
        this.loadHorarios();
        this.refresh();
        break;

      default:
        alert('Error de opcion en el td');
        break;
    }
  }

  // Regargar Pagina
  refresh(): void {
    window.location.reload();
  }
}
