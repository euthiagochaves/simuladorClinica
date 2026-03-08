import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessaoService } from '../../../core/services/sessao.service';
import { NotaClinicaRequest } from '../../../core/models/nota-clinica.model';

@Component({
  selector: 'app-painel-historia-clinica',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './painel-historia-clinica.component.html',
  styleUrl: './painel-historia-clinica.component.scss'
})
export class PainelHistoriaClinicaComponent implements OnInit {
  @Input() sessaoId!: number;
  @Output() finalizou = new EventEmitter<void>();

  private readonly sessaoService = inject(SessaoService);

  resumo = signal('');
  diagnosticoProvavel = signal('');
  diagnosticosDiferenciais = signal(['', '', '', '', '']);
  conduta = signal('');
  salvando = signal(false);
  finalizando = signal(false);
  mensagemErro = signal<string | null>(null);
  mensagemSucesso = signal<string | null>(null);

  get todosCamposPreenchidos(): boolean {
    return (
      this.resumo().trim() !== '' &&
      this.diagnosticoProvavel().trim() !== '' &&
      this.conduta().trim() !== '' &&
      this.diagnosticosDiferenciais().every(d => d.trim() !== '')
    );
  }

  ngOnInit(): void {
    this.carregarNota();
  }

  carregarNota(): void {
    this.sessaoService.buscarNotaClinica(this.sessaoId).subscribe({
      next: (nota) => {
        if (nota) {
          this.resumo.set(nota.textoResumo || '');
          this.diagnosticoProvavel.set(nota.textoDiagnosticoProvavel || '');
          this.conduta.set(nota.textoConduta || '');
          if (nota.diagnosticosDiferenciais?.length) {
            const dds = ['', '', '', '', ''];
            nota.diagnosticosDiferenciais.forEach(dd => {
              if (dd.ordemPrioridade >= 1 && dd.ordemPrioridade <= 5) {
                dds[dd.ordemPrioridade - 1] = dd.textoDiagnostico;
              }
            });
            this.diagnosticosDiferenciais.set(dds);
          }
        }
      },
      error: () => {}
    });
  }

  atualizarDiferencial(index: number, valor: string): void {
    const dds = [...this.diagnosticosDiferenciais()];
    dds[index] = valor;
    this.diagnosticosDiferenciais.set(dds);
  }

  private construirRequest(): NotaClinicaRequest {
    return {
      textoResumo: this.resumo(),
      textoDiagnosticoProvavel: this.diagnosticoProvavel(),
      textoConduta: this.conduta(),
      diagnosticosDiferenciais: this.diagnosticosDiferenciais().map((texto, i) => ({
        ordemPrioridade: i + 1,
        textoDiagnostico: texto
      }))
    };
  }

  guardarRascunho(): void {
    this.salvando.set(true);
    this.mensagemErro.set(null);
    this.sessaoService.salvarNotaClinica(this.sessaoId, this.construirRequest()).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mensagemSucesso.set('Borrador guardado correctamente.');
        setTimeout(() => this.mensagemSucesso.set(null), 3000);
      },
      error: (err) => {
        this.salvando.set(false);
        this.mensagemErro.set(err.mensagemAmigavel || 'Error al guardar el borrador.');
      }
    });
  }

  finalizar(): void {
    if (!this.todosCamposPreenchidos) {
      this.mensagemErro.set('Todos los campos son obligatorios para finalizar la atención.');
      return;
    }
    this.finalizando.set(true);
    this.mensagemErro.set(null);
    this.sessaoService.salvarNotaClinica(this.sessaoId, this.construirRequest()).subscribe({
      next: () => {
        this.sessaoService.finalizar(this.sessaoId).subscribe({
          next: () => {
            this.finalizando.set(false);
            this.finalizou.emit();
          },
          error: (err) => {
            this.finalizando.set(false);
            this.mensagemErro.set(err.mensagemAmigavel || 'Error al finalizar la atención.');
          }
        });
      },
      error: (err) => {
        this.finalizando.set(false);
        this.mensagemErro.set(err.mensagemAmigavel || 'Error al guardar la nota.');
      }
    });
  }
}
