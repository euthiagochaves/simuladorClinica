import { Component, inject, signal } from '@angular/core';
import { ImportacaoService } from '../../../core/services/importacao.service';

@Component({
  selector: 'app-importacao-yaml',
  standalone: true,
  templateUrl: './importacao-yaml.component.html',
  styleUrl: './importacao-yaml.component.scss'
})
export class ImportacaoYamlComponent {
  private readonly importacaoService = inject(ImportacaoService);

  arquivo = signal<File | null>(null);
  enviando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  onArquivoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivo.set(input.files[0]);
    }
  }

  importar(): void {
    const arq = this.arquivo();
    if (!arq) return;
    this.enviando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);
    this.importacaoService.importarYaml(arq).subscribe({
      next: () => {
        this.enviando.set(false);
        this.sucesso.set('Importación completada exitosamente.');
        this.arquivo.set(null);
      },
      error: (err) => {
        this.enviando.set(false);
        this.erro.set(err.mensagemAmigavel || 'Error al importar el archivo.');
      }
    });
  }
}
