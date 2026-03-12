import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ImportacaoService } from '../../../core/services/importacao.service';
import { ConfiguracaoService } from '../../../core/services/configuracao.service';

const CHAVE_PROMPT_IMPORTACAO = 'importacao_yaml_prompt_instrucoes';
const DESCRICAO_PROMPT_IMPORTACAO = 'Instrucciones para IA en la pantalla de importacion YAML.';
const PROMPT_PADRAO_IMPORTACAO = `Preencha este template YAML do ClinicaSim a partir do caso clínico descrito pelo usuário.

REGRAS CRÍTICAS:
1) Responda SOMENTE com YAML válido (sem markdown e sem texto fora do YAML).
2) Preserve exatamente a estrutura e os nomes das chaves do template.
3) Use EXCLUSIVAMENTE os valores fixos abaixo (não inventar variações):
- triaje: ["Urgente", "Prioritario", "Normal"]
- sexo: ["Masculino", "Femenino", "Otro"]
- secao: ["Antecedentes Hereditarios y Familiares", "Antecedentes Personales", "Datos Personales", "Historia de la Enfermedad Actual", "Motivo de Consulta"]
- categoria: ["Alergias", "Antecedentes familiares", "Cardiovascular", "Contexto social", "Dolor", "Fisiológicos", "Gastrointestinal", "Hábitos", "Identificación", "Medicación", "Medio", "Motivo de consulta", "Neurológico", "Patológicos", "Respiratorio", "Salud mental", "Sexual", "Síntomas generales", "Sueño", "Urinario", "Vacunación"]
- sistema_categoria: ["Estado General", "Aparato Cardiovascular", "Aparato Digestivo", "Sistema Respiratorio", "Sistema Nefrourológico", "Sistema Neurológico", "Sistema Osteoartromuscular", "Sistema Respiratorio"]
4) Prioridade máxima: preencher/adaptar respostas de preguntas_globales e hallazgos_globales já existentes no template.
5) Criar preguntas_del_caso e hallazgos_del_caso só em exceções reais e o mínimo possível.
6) Antes de criar item novo, tente complementar um item global semelhante.
7) Em hallazgos_del_caso, NÃO incluir presente (campo automático do sistema).
8) Signos vitales podem variar conforme o caso clínico e devem ser plausíveis.
9) Garantir coerência clínica completa entre triagem, anamnese e exame físico.
10) Linguagem clínica em espanhol, objetiva.
11) Resultado final: YAML completo, pronto para download/importação.`;

@Component({
  selector: 'app-importacao-yaml',
  standalone: true,
  templateUrl: './importacao-yaml.component.html',
  styleUrl: './importacao-yaml.component.scss'
})
export class ImportacaoYamlComponent implements OnInit {
  private readonly importacaoService = inject(ImportacaoService);
  private readonly configuracaoService = inject(ConfiguracaoService);
  private readonly router = inject(Router);

  arquivo = signal<File | null>(null);
  promptInstrucoes = signal(PROMPT_PADRAO_IMPORTACAO);
  carregandoInstrucoes = signal(false);
  salvandoInstrucoes = signal(false);
  enviando = signal(false);
  baixandoTemplate = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);
  avisosRevisao = signal<string[]>([]);
  casoCriadoId = signal<number | null>(null);

  ngOnInit(): void {
    this.carregarPromptInstrucoes();
  }

  carregarPromptInstrucoes(): void {
    this.carregandoInstrucoes.set(true);
    this.configuracaoService.buscarPorChave(CHAVE_PROMPT_IMPORTACAO).subscribe({
      next: (config) => {
        this.promptInstrucoes.set(config.valor || PROMPT_PADRAO_IMPORTACAO);
        this.carregandoInstrucoes.set(false);
      },
      error: () => {
        this.promptInstrucoes.set(PROMPT_PADRAO_IMPORTACAO);
        this.carregandoInstrucoes.set(false);
      }
    });
  }

  guardarInstrucoes(): void {
    const valor = this.promptInstrucoes().trim();
    if (!valor) {
      this.erro.set('Las instrucciones no pueden estar vacías.');
      return;
    }

    this.salvandoInstrucoes.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    this.configuracaoService.atualizar(CHAVE_PROMPT_IMPORTACAO, valor, DESCRICAO_PROMPT_IMPORTACAO).subscribe({
      next: () => {
        this.salvandoInstrucoes.set(false);
        this.sucesso.set('Instrucciones guardadas correctamente.');
      },
      error: (err) => {
        this.salvandoInstrucoes.set(false);
        this.erro.set(err.mensagemAmigavel || 'Error al guardar las instrucciones.');
      }
    });
  }

  restaurarInstrucoesPadrao(): void {
    this.promptInstrucoes.set(PROMPT_PADRAO_IMPORTACAO);
  }

  onArquivoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivo.set(input.files[0]);
      return;
    }

    this.arquivo.set(null);
  }

  baixarTemplate(): void {
    this.baixandoTemplate.set(true);
    this.erro.set(null);

    this.importacaoService.descargarPlantillaYaml().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'plantilla-caso-clinico.yaml';
        anchor.click();
        URL.revokeObjectURL(url);
        this.baixandoTemplate.set(false);
      },
      error: (err) => {
        this.baixandoTemplate.set(false);
        this.erro.set(err.mensagemAmigavel || 'Error al descargar la plantilla YAML.');
      }
    });
  }

  importar(): void {
    const arq = this.arquivo();
    if (!arq) return;

    this.enviando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);
    this.avisosRevisao.set([]);
    this.casoCriadoId.set(null);

    this.importacaoService.importarYaml(arq).subscribe({
      next: (resultado) => {
        this.enviando.set(false);
        this.sucesso.set('Importación realizada con éxito.');
        this.avisosRevisao.set(resultado.avisosRevisao ?? []);
        this.casoCriadoId.set(resultado.casoClinicoId ?? null);
        this.arquivo.set(null);
      },
      error: (err) => {
        this.enviando.set(false);
        this.erro.set(err.mensagemAmigavel || 'Error al importar el archivo.');
      }
    });
  }

  irParaEdicao(): void {
    const casoId = this.casoCriadoId();
    if (!casoId) return;
    this.router.navigate(['/admin/casos', casoId, 'editar']);
  }
}
