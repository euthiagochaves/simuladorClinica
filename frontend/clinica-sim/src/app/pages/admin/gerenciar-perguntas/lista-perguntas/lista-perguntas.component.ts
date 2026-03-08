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
  erro = signal<string | null>(null);

  get perguntasFiltradas(): Pergunta[] {
    const texto = this.filtro().toLowerCase();
    if (!texto) return this.perguntas();
    return this.perguntas().filter(p => p.texto.toLowerCase().includes(texto) || p.categoria?.toLowerCase().includes(texto));
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
