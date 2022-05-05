import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ITaller } from 'app/entities/taller/taller.model';
import { TallerService } from 'app/entities/taller/service/taller.service';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';

@Component({
  selector: 'jhi-horario-semanal',
  templateUrl: './horario-semanal.component.html',
  styleUrls: ['./horario-semanal.component.scss'],
})
export class HorarioSemanalComponent implements OnInit {
  titulo = '';

  talleres_disponibles: ITaller[] = [];
  horario_semanal: IHorario[] = [];

  constructor(public tallerService: TallerService, public horarioService: HorarioService) {
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

  buscarTaller(dia:number, hora:number):string{
      const hora_string = hora.toString();
      let taller:ITaller = {}

      this.horario_semanal.forEach(horario => {
        if (horario.diaSemana === dia && horario.horaInicioTaller?.split(":")[0] === hora_string){
          taller = horario.taller!;
        }
      });
      return taller.nombre === undefined ? ' ' : taller.nombre;
  }
}
