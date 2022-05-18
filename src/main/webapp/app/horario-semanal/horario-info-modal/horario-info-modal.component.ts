import { HttpResponse } from '@angular/common/http';
import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { IHorario } from 'app/entities/horario/horario.model';
import { TallerService } from 'app/entities/taller/service/taller.service';
import { ITaller } from 'app/entities/taller/taller.model';
import { HorarioSemanalService } from '../horario-semanal.service';

@Component({
  selector: 'jhi-horario-info-modal',
  templateUrl: "./horario-info-modal.component.html"
})
export class HorarioInfoModalComponent {
  taller:ITaller = {}
  horarios_taller:IHorario[] = []

  constructor(
    public horarioSemanalService: HorarioSemanalService,
    public tallerService: TallerService,
    public activeModal: NgbActiveModal) {
    this.tallerService.find(this.horarioSemanalService.taller.id!).subscribe({
      next: (res: HttpResponse<ITaller>) => {
        this.taller = res.body ?? {};
      }
    });
    this.horarios_taller = this.horarioSemanalService.horario_taller;
    this.horarios_taller.sort(
      function(a, b) {          
         if (a.diaSemana === b.diaSemana) {
            
          const hora_a = parseInt((a.horaInicioTaller!.split(":")[0]), 10);
          const hora_b = parseInt((b.horaInicioTaller!.split(":")[0]), 10);
          return hora_a - hora_b;
         }
         return a.diaSemana! > b.diaSemana! ? 1 : -1;
      });
  }

  formatoHorario(horario: IHorario): string {
    const semana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const dia_semana = semana[horario.diaSemana!];
    return `${dia_semana} - ${horario.horaInicioTaller!}`;
  }
}