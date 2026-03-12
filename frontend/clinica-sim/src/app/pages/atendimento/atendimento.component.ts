import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SessaoService } from '../../core/services/sessao.service';
import { Sessao } from '../../core/models/sessao.model';
import { EventoSessao } from '../../core/models/evento-sessao.model';
import { Pergunta } from '../../core/models/pergunta.model';
import { AchadoFisico } from '../../core/models/achado-fisico.model';
import { InfoPacienteComponent } from './info-paciente/info-paciente.component';
import { ChatClinicoComponent } from './chat-clinico/chat-clinico.component';
import { PainelAnamneseComponent } from './painel-anamnese/painel-anamnese.component';
import { PainelExameFisicoComponent } from './painel-exame-fisico/painel-exame-fisico.component';
import { PainelHistoriaClinicaComponent } from './painel-historia-clinica/painel-historia-clinica.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

type Aba = 'anamnese' | 'exame' | 'historia';

@Component({
  selector: 'app-atendimento',
  standalone: true,
  imports: [
    RouterLink,
    InfoPacienteComponent,
    ChatClinicoComponent,
    PainelAnamneseComponent,
    PainelExameFisicoComponent,
    PainelHistoriaClinicaComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './atendimento.component.html',
  styleUrl: './atendimento.component.scss'
})
export class AtendimentoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessaoService = inject(SessaoService);

  sessao = signal<Sessao | null>(null);
  eventos = signal<EventoSessao[]>([]);
  abaAtiva = signal<Aba>('anamnese');
  carregando = signal(false);
  erro = signal<string | null>(null);
  processando = signal(false);
  modoCegoTriagem = signal(false);
  private contadorEventoLocal = 0;

  get perguntasFeitas(): number[] {
    return this.eventos()
      .filter(e => e.tipo === 'PerguntaClicada')
      .map(e => e.id);
  }

  get achadosSelecionados(): number[] {
    return this.eventos()
      .filter(e => e.tipo === 'AchadoSelecionado')
      .map(e => e.id);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('sessaoId'));
    this.modoCegoTriagem.set(this.route.snapshot.queryParamMap.get('modoCegoTriagem') === 'true');
    this.carregarSessao(id);
  }

  carregarSessao(id: number): void {
    this.carregando.set(true);
    this.sessaoService.buscarPorId(id).subscribe({
      next: (sessao) => {
        this.sessao.set(sessao);
        this.carregarEventos(id);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(err.mensagemAmigavel || 'Error al cargar la sesión.');
        this.carregando.set(false);
      }
    });
  }

  carregarEventos(sessaoId: number): void {
    this.sessaoService.listarEventos(sessaoId).subscribe({
      next: (eventos) => this.eventos.set(eventos),
      error: () => {}
    });
  }

  trocarAba(aba: Aba): void {
    this.abaAtiva.set(aba);
  }

  onPerguntaSelecionada(pergunta: Pergunta): void {
    const sessao = this.sessao();
    if (!sessao || this.processando()) return;
    this.processando.set(true);
    this.sessaoService.fazerPergunta(sessao.id, pergunta).subscribe({
      next: (resposta) => {
        const novoEvento: EventoSessao = {
          id: --this.contadorEventoLocal,
          tipo: resposta.tipoEvento,
          textoExibido: resposta.textoExibido,
          textoResposta: resposta.textoResposta,
          segundosDesdeInicio: resposta.segundosDesdeInicio,
          ocorridoEm: new Date().toISOString()
        };
        this.eventos.update(e => [...e, novoEvento]);
        this.processando.set(false);
      },
      error: (err) => {
        this.erro.set(err.mensagemAmigavel || 'Error al realizar la pregunta.');
        this.processando.set(false);
      }
    });
  }

  onAchadoSelecionado(achado: AchadoFisico): void {
    const sessao = this.sessao();
    if (!sessao || this.processando()) return;
    this.processando.set(true);
    this.sessaoService.selecionarAchado(sessao.id, achado.id).subscribe({
      next: (resposta) => {
        const novoEvento: EventoSessao = {
          id: --this.contadorEventoLocal,
          tipo: resposta.tipoEvento,
          textoExibido: resposta.textoExibido,
          textoResposta: resposta.textoResposta,
          segundosDesdeInicio: resposta.segundosDesdeInicio,
          ocorridoEm: new Date().toISOString()
        };
        this.eventos.update(e => [...e, novoEvento]);
        this.processando.set(false);
      },
      error: (err) => {
        this.erro.set(err.mensagemAmigavel || 'Error al seleccionar el hallazgo.');
        this.processando.set(false);
      }
    });
  }

  onFinalizou(): void {
    const sessao = this.sessao();
    if (sessao) {
      this.router.navigate(['/resultado', sessao.id]);
    }
  }
}
