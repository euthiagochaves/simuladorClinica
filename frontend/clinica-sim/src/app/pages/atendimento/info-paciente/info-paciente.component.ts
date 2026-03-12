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
  @Input() modoCegoTriagem = false;

  get idadeExibicao(): string {
    if (this.modoCegoTriagem) return '';
    const idade = this.sessao.casoClinico?.idade;
    return idade === undefined || idade === null ? '' : `${idade} años`;
  }

  get sexoExibicao(): string {
    return this.modoCegoTriagem ? '' : `${this.sessao.casoClinico?.sexo ?? ''}`;
  }

  get motivoExibicao(): string {
    return this.modoCegoTriagem ? '' : `${this.sessao.casoClinico?.queixaPrincipal ?? ''}`;
  }

  get triagemExibicao(): string {
    return this.modoCegoTriagem ? '' : `${this.sessao.casoClinico?.triagem ?? ''}`;
  }
}
