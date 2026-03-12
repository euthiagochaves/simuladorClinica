import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AchadoFisicoService } from '../../../../core/services/achado-fisico.service';
import { AchadoFisico } from '../../../../core/models/achado-fisico.model';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-lista-achados',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './lista-achados.component.html',
  styleUrl: './lista-achados.component.scss'
})
export class ListaAchadosComponent implements OnInit {
  private readonly achadoService = inject(AchadoFisicoService);

  achados = signal<AchadoFisico[]>([]);
  carregando = signal(false);
  filtro = signal('');
  filtroSistema = signal('Todos');
  erro = signal<string | null>(null);

  get sistemasDisponiveis(): string[] {
    return ['Todos', ...new Set(this.achados().map(a => a.sistemaCategoria).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  get achadosFiltrados(): AchadoFisico[] {
    const texto = this.filtro().toLowerCase();
    const sistema = this.filtroSistema();

    return this.achados().filter(a => {
      const correspondeTexto = !texto || a.nome.toLowerCase().includes(texto) || a.sistemaCategoria?.toLowerCase().includes(texto);
      const correspondeSistema = sistema === 'Todos' || a.sistemaCategoria === sistema;
      return correspondeTexto && correspondeSistema;
    });
  }

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando.set(true);
    this.achadoService.listar().subscribe({
      next: (dados) => { this.achados.set(dados); this.carregando.set(false); },
      error: (err) => { this.erro.set(err.mensagemAmigavel || 'Error'); this.carregando.set(false); }
    });
  }

  excluir(id: number): void {
    if (!confirm('¿Está seguro de eliminar este hallazgo?')) return;
    this.achadoService.excluir(id).subscribe({
      next: () => this.achados.update(lista => lista.filter(a => a.id !== id)),
      error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al eliminar.')
    });
  }
}
