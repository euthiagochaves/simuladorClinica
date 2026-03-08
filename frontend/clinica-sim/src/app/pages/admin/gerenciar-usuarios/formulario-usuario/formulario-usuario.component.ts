import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-formulario-usuario',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './formulario-usuario.component.html',
  styleUrl: './formulario-usuario.component.scss'
})
export class FormularioUsuarioComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);

  id = signal<number | null>(null);
  salvando = signal(false);
  erro = signal<string | null>(null);
  nomeCompleto = signal('');
  email = signal('');
  perfil = signal('');
  ativo = signal(true);

  get modoEdicao(): boolean { return this.id() !== null; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.usuarioService.buscarPorId(Number(idParam)).subscribe({
        next: (u) => { this.nomeCompleto.set(u.nomeCompleto); this.email.set(u.email); this.perfil.set(u.perfil); this.ativo.set(u.ativo); },
        error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al cargar.')
      });
    }
  }

  salvar(): void {
    const dados: Partial<Usuario> = { nomeCompleto: this.nomeCompleto(), email: this.email(), perfil: this.perfil(), ativo: this.ativo() };
    this.salvando.set(true);
    this.erro.set(null);
    const obs = this.modoEdicao ? this.usuarioService.atualizar(this.id()!, dados) : this.usuarioService.criar(dados);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: (err) => { this.salvando.set(false); this.erro.set(err.mensagemAmigavel || 'Error al guardar.'); }
    });
  }
}
