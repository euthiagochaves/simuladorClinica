import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

  get modoEdicao(): boolean { return this.id() !== null; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.perguntaService.buscarPorId(Number(idParam)).subscribe({
        next: (p) => { this.texto.set(p.texto); this.secao.set(p.secao); this.categoria.set(p.categoria); this.respostaPadrao.set(p.respostaPadrao); this.ativo.set(p.ativo); },
        error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
      });
    }
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
