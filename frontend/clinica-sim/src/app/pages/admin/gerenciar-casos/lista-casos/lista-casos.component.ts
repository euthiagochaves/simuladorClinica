import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CasoClinicoService } from '../../../../core/services/caso-clinico.service';
import { CasoClinico } from '../../../../core/models/caso-clinico.model';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-lista-casos',
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingSpinnerComponent],
  templateUrl: './lista-casos.component.html',
  styleUrl: './lista-casos.component.scss'
})
export class ListaCasosComponent implements OnInit {
  private readonly casoClinicoService = inject(CasoClinicoService);

  casos = signal<CasoClinico[]>([]);
  carregando = signal(false);
  filtro = signal('');
  erro = signal<string | null>(null);

  get casosFiltrados(): CasoClinico[] {
    const texto = this.filtro().toLowerCase();
    if (!texto) return this.casos();
    return this.casos().filter(c =>
      c.titulo.toLowerCase().includes(texto) ||
      c.nomePaciente.toLowerCase().includes(texto)
    );
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.casoClinicoService.listar().subscribe({
      next: (dados) => { this.casos.set(dados); this.carregando.set(false); },
      error: (err) => { this.erro.set(err.mensagemAmigavel || 'Error'); this.carregando.set(false); }
    });
  }

  excluir(id: number, titulo: string): void {
    if (!confirm(`¿Está seguro de desactivar este caso?\n"${titulo}"`)) return;
    this.casoClinicoService.excluir(id).subscribe({
      next: () => this.casos.update(lista => lista.filter(c => c.id !== id)),
      error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al eliminar.')
    });
  }
}
