import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

  readonly sistemas = ['EstadoGeral', 'Cardiovascular', 'Digestivo', 'Respiratorio', 'Nefrologico', 'Neurologico', 'Osteoarticular'];

  get modoEdicao(): boolean { return this.id() !== null; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.achadoService.buscarPorId(Number(idParam)).subscribe({
        next: (a) => { this.nome.set(a.nome); this.sistemaCategoria.set(a.sistemaCategoria); this.resultadoPadrao.set(a.resultadoPadrao); this.ativo.set(a.ativo); },
        error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
      });
    }
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
