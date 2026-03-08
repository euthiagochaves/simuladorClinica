import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CasoClinicoService } from '../../../../core/services/caso-clinico.service';
import { CasoClinico } from '../../../../core/models/caso-clinico.model';

@Component({
  selector: 'app-formulario-caso',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './formulario-caso.component.html',
  styleUrl: './formulario-caso.component.scss'
})
export class FormularioCasoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly casoService = inject(CasoClinicoService);

  id = signal<number | null>(null);
  salvando = signal(false);
  erro = signal<string | null>(null);

  titulo = signal('');
  nomePaciente = signal('');
  idadePaciente = signal<number>(0);
  sexoPaciente = signal('');
  queixaPrincipal = signal('');
  triagem = signal('');
  descricao = signal('');
  ativo = signal(true);

  get modoEdicao(): boolean { return this.id() !== null; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.carregarCaso(Number(idParam));
    }
  }

  carregarCaso(id: number): void {
    this.casoService.buscarPorId(id).subscribe({
      next: (caso) => {
        this.titulo.set(caso.titulo);
        this.nomePaciente.set(caso.nomePaciente);
        this.idadePaciente.set(caso.idadePaciente);
        this.sexoPaciente.set(caso.sexoPaciente);
        this.queixaPrincipal.set(caso.queixaPrincipal);
        this.triagem.set(caso.triagem);
        this.descricao.set(caso.descricao || '');
        this.ativo.set(caso.ativo);
      },
      error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
    });
  }

  salvar(): void {
    const dados: Partial<CasoClinico> = {
      titulo: this.titulo(),
      nomePaciente: this.nomePaciente(),
      idadePaciente: this.idadePaciente(),
      sexoPaciente: this.sexoPaciente(),
      queixaPrincipal: this.queixaPrincipal(),
      triagem: this.triagem(),
      descricao: this.descricao(),
      ativo: this.ativo()
    };

    this.salvando.set(true);
    this.erro.set(null);

    const obs = this.modoEdicao
      ? this.casoService.atualizar(this.id()!, dados)
      : this.casoService.criar(dados);

    obs.subscribe({
      next: () => this.router.navigate(['/admin/casos']),
      error: (err) => { this.salvando.set(false); this.erro.set(err.mensagemAmigavel || 'Error al guardar.'); }
    });
  }
}
