import { Component, Input } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { Sessao } from '../../../core/models/sessao.model';

@Component({
  selector: 'app-info-paciente',
  standalone: true,
  imports: [LowerCasePipe],
  templateUrl: './info-paciente.component.html',
  styleUrl: './info-paciente.component.scss'
})
export class InfoPacienteComponent {
  @Input() sessao!: Sessao;
}
