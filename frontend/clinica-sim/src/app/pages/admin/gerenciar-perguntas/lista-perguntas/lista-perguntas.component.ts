import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PerguntaService } from '../../../../core/services/pergunta.service';
import { Pergunta } from '../../../../core/models/pergunta.model';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-lista-perguntas',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './lista-perguntas.component.html',
  styleUrl: './lista-perguntas.component.scss'
})
export class ListaPerguntasComponent implements OnInit {
  private readonly perguntaService = inject(PerguntaService);

  perguntas = signal<Pergunta[]>([]);
  carregando = signal(false);
  filtro = signal('');
  filtroSecao = signal('Todas');
  filtroCategoria = signal('Todas');
  erro = signal<string | null>(null);

  get secoesDisponiveis(): string[] {
    return ['Todas', ...new Set(this.perguntas().map(p => p.secao).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  get categoriasDisponiveis(): string[] {
    return ['Todas', ...new Set(this.perguntas().map(p => p.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  get perguntasFiltradas(): Pergunta[] {
    const texto = this.filtro().toLowerCase();
    const secao = this.filtroSecao();
    const categoria = this.filtroCategoria();

    return this.perguntas().filter(p => {
      const correspondeTexto = !texto
        || p.texto.toLowerCase().includes(texto)
        || p.secao?.toLowerCase().includes(texto)
        || p.categoria?.toLowerCase().includes(texto);
      const correspondeSecao = secao === 'Todas' || p.secao === secao;
      const correspondeCategoria = categoria === 'Todas' || p.categoria === categoria;
      return correspondeTexto && correspondeSecao && correspondeCategoria;
    });
  }

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando.set(true);
    this.perguntaService.listar().subscribe({
      next: (dados) => { this.perguntas.set(dados); this.carregando.set(false); },
      error: (err) => { this.erro.set(err.mensagemAmigavel || 'Error'); this.carregando.set(false); }
    });
  }

  excluir(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta pregunta?')) return;
    this.perguntaService.excluir(id).subscribe({
      next: () => this.perguntas.update(lista => lista.filter(p => p.id !== id)),
      error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al eliminar.')
    });
  }
}
