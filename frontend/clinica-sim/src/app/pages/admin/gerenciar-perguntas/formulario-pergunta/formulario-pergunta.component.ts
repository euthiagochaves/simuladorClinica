import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PerguntaService } from '../../../../core/services/pergunta.service';
import { Pergunta } from '../../../../core/models/pergunta.model';

@Component({
  selector: 'app-formulario-pergunta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './formulario-pergunta.component.html',
  styleUrl: './formulario-pergunta.component.scss'
})
export class FormularioPerguntaComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly perguntaService = inject(PerguntaService);

  id = signal<number | null>(null);
  salvando = signal(false);
  erro = signal<string | null>(null);
  texto = signal('');
  secao = signal('');
  categoria = signal('');
  respostaPadrao = signal('');
  ativo = signal(true);
  secoesDisponiveis = signal<string[]>([]);
  categoriasDisponiveis = signal<string[]>([]);

  get modoEdicao(): boolean { return this.id() !== null; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const perguntaId = idParam ? Number(idParam) : null;
    if (perguntaId) {
      this.id.set(perguntaId);
    }

    if (perguntaId) {
      forkJoin({
        perguntas: this.perguntaService.listar(),
        perguntaAtual: this.perguntaService.buscarPorId(perguntaId)
      }).subscribe({
        next: (resultado) => {
          const { perguntas, perguntaAtual } = resultado as { perguntas: Pergunta[]; perguntaAtual: Pergunta };
          this.definirOpcoes(perguntas);
          this.texto.set(perguntaAtual.texto);
          this.secao.set(perguntaAtual.secao);
          this.categoria.set(perguntaAtual.categoria);
          this.respostaPadrao.set(perguntaAtual.respostaPadrao);
          this.ativo.set(perguntaAtual.ativo);
          this.garantirOpcao(this.secoesDisponiveis, perguntaAtual.secao);
          this.garantirOpcao(this.categoriasDisponiveis, perguntaAtual.categoria);
        },
        error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
      });

      return;
    }

    this.perguntaService.listar().subscribe({
      next: (perguntas) => {
        this.definirOpcoes(perguntas);
        this.secao.set(this.secoesDisponiveis()[0] ?? '');
        this.categoria.set(this.categoriasDisponiveis()[0] ?? '');
      },
      error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
    });
  }

  private definirOpcoes(perguntas: Pergunta[]): void {
    this.secoesDisponiveis.set(this.extrairValores(perguntas.map(pergunta => pergunta.secao)));
    this.categoriasDisponiveis.set(this.extrairValores(perguntas.map(pergunta => pergunta.categoria)));
  }

  private extrairValores(valores: Array<string | null | undefined>): string[] {
    return [...new Set(valores.filter((valor): valor is string => Boolean(valor?.trim())).map(valor => valor.trim()))]
      .sort((a, b) => a.localeCompare(b));
  }

  private garantirOpcao(signalOpcoes: WritableSignal<string[]>, valor: string): void {
    if (!valor || signalOpcoes().includes(valor)) {
      return;
    }

    signalOpcoes.set([...signalOpcoes(), valor].sort((a, b) => a.localeCompare(b)));
  }

  salvar(): void {
    const dados: Partial<Pergunta> = { texto: this.texto(), secao: this.secao(), categoria: this.categoria(), respostaPadrao: this.respostaPadrao(), ativo: this.ativo() };
    this.salvando.set(true);
    this.erro.set(null);
    const obs = this.modoEdicao ? this.perguntaService.atualizar(this.id()!, dados) : this.perguntaService.criar(dados);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/perguntas']),
      error: (err) => { this.salvando.set(false); this.erro.set(err.mensagemAmigavel || 'Error al guardar.'); }
    });
  }
}
