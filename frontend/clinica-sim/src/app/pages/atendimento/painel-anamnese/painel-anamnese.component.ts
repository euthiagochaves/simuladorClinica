import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerguntaService } from '../../../core/services/pergunta.service';
import { Pergunta } from '../../../core/models/pergunta.model';

@Component({
  selector: 'app-painel-anamnese',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './painel-anamnese.component.html',
  styleUrl: './painel-anamnese.component.scss'
})
export class PainelAnamneseComponent implements OnInit {
  @Input() perguntasJaFeitas: number[] = [];
  @Output() perguntaSelecionada = new EventEmitter<Pergunta>();

  private readonly perguntaService = inject(PerguntaService);

  perguntas = signal<Pergunta[]>([]);
  filtroTexto = signal('');
  filtroCategoria = signal('');
  carregando = signal(false);

  get categorias(): string[] {
    const cats = this.perguntas().map(p => p.categoria).filter(Boolean);
    return [...new Set(cats)].sort();
  }

  get perguntasFiltradas(): Pergunta[] {
    const texto = this.filtroTexto().toLowerCase();
    const categoria = this.filtroCategoria();
    return this.perguntas()
      .filter(p =>
        (!texto || p.texto.toLowerCase().includes(texto)) &&
        (!categoria || p.categoria === categoria)
      )
      .sort((a, b) => a.texto.localeCompare(b.texto));
  }

  get totalJaFeitas(): number {
    return this.perguntasJaFeitas.length;
  }

  ngOnInit(): void {
    this.carregarPerguntas();
  }

  carregarPerguntas(): void {
    this.carregando.set(true);
    this.perguntaService.listar(true).subscribe({
      next: (dados) => {
        this.perguntas.set(dados);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  selecionarPergunta(pergunta: Pergunta): void {
    this.perguntaSelecionada.emit(pergunta);
  }

  jaFoiFeita(id: number): boolean {
    return this.perguntasJaFeitas.includes(id);
  }
}
