import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { AchadoFisicoService } from '../../../core/services/achado-fisico.service';
import { AchadoFisico } from '../../../core/models/achado-fisico.model';

interface GrupoAchados {
  sistema: string;
  achados: AchadoFisico[];
  expandido: boolean;
}

@Component({
  selector: 'app-painel-exame-fisico',
  standalone: true,
  templateUrl: './painel-exame-fisico.component.html',
  styleUrl: './painel-exame-fisico.component.scss'
})
export class PainelExameFisicoComponent implements OnInit {
  @Input() achadosSelecionados: number[] = [];
  @Output() achadoSelecionado = new EventEmitter<AchadoFisico>();

  private readonly achadoFisicoService = inject(AchadoFisicoService);

  grupos = signal<GrupoAchados[]>([]);
  carregando = signal(false);

  private readonly ordemSistemas: Record<string, string> = {
    'EstadoGeral': 'Estado General',
    'Cardiovascular': 'Aparato Cardiovascular',
    'Digestivo': 'Aparato Digestivo',
    'Respiratorio': 'Sistema Respiratorio',
    'Nefrologico': 'Sistema Nefrourológico',
    'Neurologico': 'Sistema Neurológico',
    'Osteoarticular': 'Sistema Osteoartromuscular'
  };

  get totalSelecionados(): number {
    return this.achadosSelecionados.length;
  }

  ngOnInit(): void {
    this.carregarAchados();
  }

  carregarAchados(): void {
    this.carregando.set(true);
    this.achadoFisicoService.listar(true).subscribe({
      next: (dados) => {
        const gruposMap = new Map<string, AchadoFisico[]>();
        dados.forEach(a => {
          const lista = gruposMap.get(a.sistemaCategoria) ?? [];
          lista.push(a);
          gruposMap.set(a.sistemaCategoria, lista);
        });

        const gruposOrdenados: GrupoAchados[] = [];
        Object.keys(this.ordemSistemas).forEach(chave => {
          const achados = gruposMap.get(chave) ?? [];
          if (achados.length > 0) {
            gruposOrdenados.push({
              sistema: this.ordemSistemas[chave] || chave,
              achados,
              expandido: false
            });
          }
          gruposMap.delete(chave);
        });
        gruposMap.forEach((achados, chave) => {
          gruposOrdenados.push({ sistema: chave, achados, expandido: false });
        });

        this.grupos.set(gruposOrdenados);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  toggleGrupo(grupo: GrupoAchados): void {
    grupo.expandido = !grupo.expandido;
  }

  selecionarAchado(achado: AchadoFisico): void {
    this.achadoSelecionado.emit(achado);
  }

  jaFoiSelecionado(id: number): boolean {
    return this.achadosSelecionados.includes(id);
  }
}
