import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ConfiguracaoService } from '../../../core/services/configuracao.service';
import { ConfiguracaoSistema } from '../../../core/models/configuracao-sistema.model';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.scss'
})
export class ConfiguracoesComponent implements OnInit {
  private readonly configuracaoService = inject(ConfiguracaoService);

  configuracoes = signal<ConfiguracaoSistema[]>([]);
  carregando = signal(false);
  salvando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.configuracaoService.listar().subscribe({
      next: (dados) => { this.configuracoes.set(dados || []); this.carregando.set(false); },
      error: () => { this.configuracoes.set([]); this.carregando.set(false); }
    });
  }

  salvar(): void {
    const configs = this.configuracoes();
    if (configs.length === 0) return;

    this.salvando.set(true);
    this.erro.set(null);

    const requests = configs.map(c =>
      this.configuracaoService.atualizar(c.chave, c.valor, c.descricao)
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.salvando.set(false);
        this.sucesso.set('Configuración guardada correctamente.');
        setTimeout(() => this.sucesso.set(null), 3000);
      },
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err.mensagemAmigavel || 'Error al guardar la configuración.');
      }
    });
  }
}
