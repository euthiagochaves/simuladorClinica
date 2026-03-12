import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { CasoClinicoService } from '../../core/services/caso-clinico.service';
import { SessaoService } from '../../core/services/sessao.service';
import { CasoClinico } from '../../core/models/caso-clinico.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, LoadingSpinnerComponent, LowerCasePipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  private readonly casoClinicoService = inject(CasoClinicoService);
  private readonly sessaoService = inject(SessaoService);
  private readonly router = inject(Router);

  casos = signal<CasoClinico[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);
  iniciandoSessao = signal<number | null>(null);
  iniciandoAleatorio = signal(false);
  casoInfoAbertaId = signal<number | null>(null);

  ngOnInit(): void {
    this.carregarCasos();
  }

  carregarCasos(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.casoClinicoService.listar(true).subscribe({
      next: (dados) => {
        this.casos.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(err.mensagemAmigavel || 'Error al cargar los casos clínicos.');
        this.carregando.set(false);
      }
    });
  }

  iniciarAtendimento(casoId: number): void {
    this.iniciandoSessao.set(casoId);
    this.sessaoService.criar({ casoClinicoId: casoId, alunoId: null }).subscribe({
      next: (sessao) => {
        this.iniciandoSessao.set(null);
        this.router.navigate(['/atendimento', sessao.id]);
      },
      error: (err) => {
        this.iniciandoSessao.set(null);
        this.erro.set(err.mensagemAmigavel || 'Error al iniciar la atención.');
      }
    });
  }

  toggleInfoTriagem(casoId: number): void {
    this.casoInfoAbertaId.update((atual) => atual === casoId ? null : casoId);
  }

  iniciarAtendimentoAleatorio(): void {
    const ativos = this.casos();
    if (ativos.length === 0) return;

    const indice = Math.floor(Math.random() * ativos.length);
    const caso = ativos[indice];

    this.iniciandoAleatorio.set(true);
    this.erro.set(null);
    this.sessaoService.criar({ casoClinicoId: caso.id, alunoId: null }).subscribe({
      next: (sessao) => {
        this.iniciandoAleatorio.set(false);
        this.router.navigate(['/atendimento', sessao.id], { queryParams: { modoCegoTriagem: 'true' } });
      },
      error: (err) => {
        this.iniciandoAleatorio.set(false);
        this.erro.set(err.mensagemAmigavel || 'Error al iniciar la atención aleatoria.');
      }
    });
  }
}
