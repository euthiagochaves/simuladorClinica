import { Component, OnInit, inject, signal } from '@angular/core';
import { ConfiguracaoService } from '../../../core/services/configuracao.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.scss'
})
export class ConfiguracoesComponent implements OnInit {
  private readonly configuracaoService = inject(ConfiguracaoService);

  configuracoes = signal<any>({});
  carregando = signal(false);
  salvando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  ngOnInit(): void {
    this.carregando.set(true);
    this.configuracaoService.buscar().subscribe({
      next: (dados) => { this.configuracoes.set(dados || {}); this.carregando.set(false); },
      error: () => { this.configuracoes.set({}); this.carregando.set(false); }
    });
  }

  salvar(): void {
    this.salvando.set(true);
    this.erro.set(null);
    this.configuracaoService.salvar(this.configuracoes()).subscribe({
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
