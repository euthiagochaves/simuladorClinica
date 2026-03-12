import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AchadoFisicoService } from '../../../../core/services/achado-fisico.service';
import { AchadoFisico } from '../../../../core/models/achado-fisico.model';

@Component({
  selector: 'app-formulario-achado',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './formulario-achado.component.html',
  styleUrl: './formulario-achado.component.scss'
})
export class FormularioAchadoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly achadoService = inject(AchadoFisicoService);

  id = signal<number | null>(null);
  salvando = signal(false);
  erro = signal<string | null>(null);
  nome = signal('');
  sistemaCategoria = signal('');
  resultadoPadrao = signal('');
  ativo = signal(true);
  sistemasDisponiveis = signal<string[]>([]);

  get modoEdicao(): boolean { return this.id() !== null; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const achadoId = idParam ? Number(idParam) : null;
    if (achadoId) {
      this.id.set(achadoId);
    }

    if (achadoId) {
      forkJoin({
        achados: this.achadoService.listar(),
        achadoAtual: this.achadoService.buscarPorId(achadoId)
      }).subscribe({
        next: (resultado) => {
          const { achados, achadoAtual } = resultado as { achados: AchadoFisico[]; achadoAtual: AchadoFisico };
          this.sistemasDisponiveis.set(this.extrairSistemas(achados));
          this.nome.set(achadoAtual.nome);
          this.sistemaCategoria.set(achadoAtual.sistemaCategoria);
          this.resultadoPadrao.set(achadoAtual.resultadoPadrao);
          this.ativo.set(achadoAtual.ativo);
          this.garantirSistema(achadoAtual.sistemaCategoria);
          this.sistemaCategoria.set(achadoAtual.sistemaCategoria);
        },
        error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
      });

      return;
    }

    this.achadoService.listar().subscribe({
      next: (achados) => {
        this.sistemasDisponiveis.set(this.extrairSistemas(achados));
        this.sistemaCategoria.set(this.sistemasDisponiveis()[0] ?? '');
      },
      error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
    });
  }

  private extrairSistemas(achados: AchadoFisico[]): string[] {
    return [...new Set(
      achados
        .map(achado => achado.sistemaCategoria)
        .filter((valor): valor is string => Boolean(valor?.trim()))
        .map(valor => valor.trim())
    )].sort((a, b) => a.localeCompare(b));
  }

  private garantirSistema(valor: string): void {
    if (!valor || this.sistemasDisponiveis().includes(valor)) {
      return;
    }

    this.sistemasDisponiveis.set([...this.sistemasDisponiveis(), valor].sort((a, b) => a.localeCompare(b)));
  }

  salvar(): void {
    const dados: Partial<AchadoFisico> = { nome: this.nome(), sistemaCategoria: this.sistemaCategoria(), resultadoPadrao: this.resultadoPadrao(), ativo: this.ativo() };
    this.salvando.set(true);
    this.erro.set(null);
    const obs = this.modoEdicao ? this.achadoService.atualizar(this.id()!, dados) : this.achadoService.criar(dados);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/achados']),
      error: (err) => { this.salvando.set(false); this.erro.set(err.mensagemAmigavel || 'Error al guardar.'); }
    });
  }
}
