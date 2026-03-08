import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SessaoService } from '../../core/services/sessao.service';
import { Sessao } from '../../core/models/sessao.model';
import { EventoSessao } from '../../core/models/evento-sessao.model';
import { NotaClinica } from '../../core/models/nota-clinica.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent, DatePipe],
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.scss'
})
export class ResultadoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sessaoService = inject(SessaoService);

  sessao = signal<Sessao | null>(null);
  eventos = signal<EventoSessao[]>([]);
  nota = signal<NotaClinica | null>(null);
  carregando = signal(false);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('sessaoId'));
    this.carregarDados(id);
  }

  carregarDados(id: number): void {
    this.carregando.set(true);
    forkJoin({
      sessao: this.sessaoService.buscarPorId(id),
      eventos: this.sessaoService.listarEventos(id),
      nota: this.sessaoService.buscarNotaClinica(id)
    }).subscribe({
      next: ({ sessao, eventos, nota }) => {
        this.sessao.set(sessao);
        this.eventos.set(eventos);
        this.nota.set(nota);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(err.mensagemAmigavel || 'Error al cargar los resultados.');
        this.carregando.set(false);
      }
    });
  }

  formatarTempo(segundos: number): string {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  }

  gerarPdf(): void {
    window.print();
  }
}
