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
  textoPergunta = signal('');
  categoria = signal('');
  ativa = signal(true);

  get modoEdicao(): boolean { return this.id() !== null; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.perguntaService.buscarPorId(Number(idParam)).subscribe({
        next: (p) => { this.textoPergunta.set(p.textoPergunta); this.categoria.set(p.categoria); this.ativa.set(p.ativa); },
        error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
      });
    }
  }

  salvar(): void {
    const dados: Partial<Pergunta> = { textoPergunta: this.textoPergunta(), categoria: this.categoria(), ativa: this.ativa() };
    this.salvando.set(true);
    this.erro.set(null);
    const obs = this.modoEdicao ? this.perguntaService.atualizar(this.id()!, dados) : this.perguntaService.criar(dados);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/perguntas']),
      error: (err) => { this.salvando.set(false); this.erro.set(err.mensagemAmigavel || 'Error al guardar.'); }
    });
  }
}
