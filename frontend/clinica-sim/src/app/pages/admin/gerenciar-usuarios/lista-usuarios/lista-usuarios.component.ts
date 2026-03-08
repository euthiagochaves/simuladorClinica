import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss'
})
export class ListaUsuariosComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);
  carregando = signal(false);
  filtro = signal('');
  erro = signal<string | null>(null);

  get usuariosFiltrados(): Usuario[] {
    const texto = this.filtro().toLowerCase();
    if (!texto) return this.usuarios();
    return this.usuarios().filter(u => u.nome.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto));
  }

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando.set(true);
    this.usuarioService.listar().subscribe({
      next: (dados) => { this.usuarios.set(dados); this.carregando.set(false); },
      error: (err) => { this.erro.set(err.mensagemAmigavel || 'Error'); this.carregando.set(false); }
    });
  }

  excluir(id: number): void {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;
    this.usuarioService.excluir(id).subscribe({
      next: () => this.usuarios.update(lista => lista.filter(u => u.id !== id)),
      error: (err) => this.erro.set(err.mensagemAmigavel || 'Error al eliminar.')
    });
  }
}
