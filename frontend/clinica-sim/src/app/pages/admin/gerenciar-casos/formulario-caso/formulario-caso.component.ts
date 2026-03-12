import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CasoClinicoService } from '../../../../core/services/caso-clinico.service';
import { PerguntaService } from '../../../../core/services/pergunta.service';
import { AchadoFisicoService } from '../../../../core/services/achado-fisico.service';
import { CasoClinico } from '../../../../core/models/caso-clinico.model';
import { Pergunta } from '../../../../core/models/pergunta.model';
import { PerguntaCaso } from '../../../../core/models/pergunta-caso.model';
import { RespostaCaso } from '../../../../core/models/resposta-caso.model';
import { AchadoFisico } from '../../../../core/models/achado-fisico.model';
import { AchadoCaso } from '../../../../core/models/achado-caso.model';

type AbaFormulario = 'triagem' | 'anamnesis' | 'exame-fisico';

interface RespostaGlobalEdicao {
  id?: number;
  perguntaId: number;
  textoPergunta: string;
  textoResposta: string;
  destacada: boolean;
}

interface PerguntaCasoEdicao {
  id?: number;
  localId: number;
  texto: string;
  secao: string;
  categoria: string;
  respostaPadrao: string;
  ordemExibicao: number;
  ativo: boolean;
}

interface AchadoCasoEdicao {
  id?: number;
  localId: number;
  achadoFisicoId: number;
  nomeAchado: string;
  sistemaCategoria: string;
  presente: boolean;
  textoDetalhe: string;
  destacado: boolean;
}

@Component({
  selector: 'app-formulario-caso',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './formulario-caso.component.html',
  styleUrl: './formulario-caso.component.scss'
})
export class FormularioCasoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly casoService = inject(CasoClinicoService);
  private readonly perguntaService = inject(PerguntaService);
  private readonly achadoFisicoService = inject(AchadoFisicoService);

  id = signal<number | null>(null);
  abaAtiva = signal<AbaFormulario>('triagem');
  carregando = signal(false);
  salvando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  titulo = signal('');
  nomePaciente = signal('');
  idade = signal<number>(0);
  sexo = signal('');
  queixaPrincipal = signal('');
  triagem = signal('');
  resumo = signal('');
  ativo = signal(true);

  perguntasGlobais = signal<Pergunta[]>([]);
  respostasGlobaisCaso = signal<RespostaGlobalEdicao[]>([]);
  respostasGlobaisOriginais = signal<RespostaCaso[]>([]);
  filtroSecaoPerguntasGlobais = signal('Todas');
  acordeaoPerguntasCasoAberto = signal(true);
  acordeaoPerguntasGlobaisAberto = signal(true);

  perguntasCaso = signal<PerguntaCasoEdicao[]>([]);
  perguntasCasoOriginais = signal<PerguntaCaso[]>([]);

  novaPerguntaCasoTexto = signal('');
  novaPerguntaCasoSecao = signal('');
  novaPerguntaCasoCategoria = signal('');
  novaPerguntaCasoRespostaPadrao = signal('');
  novaPerguntaCasoOrdem = signal(0);
  novaPerguntaCasoAtiva = signal(true);

  achadosGlobais = signal<AchadoFisico[]>([]);
  achadosCaso = signal<AchadoCasoEdicao[]>([]);
  achadosCasoOriginais = signal<AchadoCaso[]>([]);
  acordeaoAchadosGlobaisAberto = signal(true);
  acordeaoAchadosCasoAberto = signal(true);
  filtroSistemaAchadosGlobais = signal('Todos');
  filtroSistemaAchadosCaso = signal('Todos');

  novoAchadoCasoId = signal<number | null>(null);
  novoAchadoCasoTextoDetalhe = signal('');
  novoAchadoCasoPresente = signal(false);
  novoAchadoCasoDestacado = signal(false);

  private contadorLocalPerguntaCaso = -1;
  private contadorLocalAchadoCaso = -1;

  readonly secoesGlobais = computed(() =>
    ['Todas', ...new Set(this.perguntasGlobais().map(p => p.secao).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  );

  readonly secoesParaPerguntaCaso = computed(() =>
    [...new Set(this.perguntasGlobais().map(p => p.secao).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  );

  readonly categoriasParaPerguntaCaso = computed(() =>
    [...new Set(this.perguntasGlobais().map(p => p.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  );

  readonly sistemasAchados = computed(() =>
    ['Todos', ...new Set(this.achadosGlobais().map(a => a.sistemaCategoria).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  );

  readonly achadosGlobaisDisponiveis = computed(() => {
    const idsSelecionados = new Set(this.achadosCaso().map(a => a.achadoFisicoId));
    return this.achadosGlobais().filter(a => !idsSelecionados.has(a.id));
  });

  readonly respostasGlobaisFiltradas = computed(() => {
    const filtroSecao = this.filtroSecaoPerguntasGlobais();
    return this.respostasGlobaisCaso()
      .filter(r => filtroSecao === 'Todas' || this.obterSecaoPerguntaGlobal(r.perguntaId) === filtroSecao)
      .sort((a, b) => a.textoPergunta.localeCompare(b.textoPergunta));
  });

  readonly achadosCasoFiltrados = computed(() => {
    const filtroSistema = this.filtroSistemaAchadosCaso();
    return this.achadosCaso()
      .filter(a => filtroSistema === 'Todos' || a.sistemaCategoria === filtroSistema)
      .sort((a, b) => a.nomeAchado.localeCompare(b.nomeAchado));
  });

  readonly achadosGlobaisFiltrados = computed(() => {
    const filtroSistema = this.filtroSistemaAchadosGlobais();
    return this.achadosGlobais()
      .filter(a => filtroSistema === 'Todos' || a.sistemaCategoria === filtroSistema)
      .sort((a, b) => a.nome.localeCompare(b.nome));
  });

  get modoEdicao(): boolean {
    return this.id() !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
    }

    this.carregarDadosIniciais();
  }

  async carregarDadosIniciais(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    try {
      await Promise.all([this.carregarPerguntasGlobais(), this.carregarAchadosGlobais()]);

      if (this.modoEdicao) {
        await this.carregarCasoCompleto(this.id()!);
      } else {
        const secoes = this.secoesParaPerguntaCaso();
        const categorias = this.categoriasParaPerguntaCaso();
        this.novaPerguntaCasoSecao.set(secoes[0] || '');
        this.novaPerguntaCasoCategoria.set(categorias[0] || '');
      }
    } catch (err: any) {
      this.erro.set(err?.mensagemAmigavel || 'Error al cargar los datos del caso.');
    } finally {
      this.carregando.set(false);
    }
  }

  async carregarPerguntasGlobais(): Promise<void> {
    const perguntas = await firstValueFrom(this.perguntaService.listar(true));
    this.perguntasGlobais.set(perguntas.filter(p => !p.ehPerguntaCaso));
  }

  async carregarAchadosGlobais(): Promise<void> {
    const achados = await firstValueFrom(this.achadoFisicoService.listar(true));
    this.achadosGlobais.set(achados);
  }

  async carregarCasoCompleto(id: number): Promise<void> {
    const [caso, respostas, perguntasCaso, achadosCaso] = await Promise.all([
      firstValueFrom(this.casoService.buscarPorId(id)),
      firstValueFrom(this.casoService.listarRespostasCaso(id)),
      firstValueFrom(this.casoService.listarPerguntasCasos(id)),
      firstValueFrom(this.casoService.listarAchadosFisicosCaso(id))
    ]);

    this.preencherDadosCaso(caso);
    this.preencherRespostasGlobais(respostas);
    this.preencherPerguntasCaso(perguntasCaso);
    this.preencherAchadosCaso(achadosCaso);
  }

  preencherDadosCaso(caso: CasoClinico): void {
    this.titulo.set(caso.titulo);
    this.nomePaciente.set(caso.nomePaciente);
    this.idade.set(caso.idade);
    this.sexo.set(caso.sexo);
    this.queixaPrincipal.set(caso.queixaPrincipal);
    this.triagem.set(caso.triagem || '');
    this.resumo.set(caso.resumo || '');
    this.ativo.set(caso.ativo);
  }

  preencherRespostasGlobais(respostas: RespostaCaso[]): void {
    this.respostasGlobaisOriginais.set(respostas);

    const respostasPorPerguntaId = new Map(respostas.map(r => [r.perguntaId, r]));
    const respostasEdicao = this.perguntasGlobais().map(pergunta => {
      const respostaExistente = respostasPorPerguntaId.get(pergunta.id);
      return {
        id: respostaExistente?.id,
        perguntaId: pergunta.id,
        textoPergunta: pergunta.texto,
        textoResposta: respostaExistente?.textoResposta ?? pergunta.respostaPadrao,
        destacada: respostaExistente?.destacada ?? false
      };
    });

    this.respostasGlobaisCaso.set(respostasEdicao);
  }

  preencherPerguntasCaso(perguntasCaso: PerguntaCaso[]): void {
    this.perguntasCasoOriginais.set(perguntasCaso);

    const perguntasEdicao = perguntasCaso.map(p => ({
      id: p.id,
      localId: p.id,
      texto: p.texto,
      secao: p.secao,
      categoria: p.categoria,
      respostaPadrao: p.respostaPadrao,
      ordemExibicao: p.ordemExibicao,
      ativo: p.ativo
    }));

    this.perguntasCaso.set(perguntasEdicao);
  }

  preencherAchadosCaso(achadosCaso: AchadoCaso[]): void {
    this.achadosCasoOriginais.set(achadosCaso);

    const achadosEdicao = achadosCaso.map(a => {
      const achadoGlobal = this.achadosGlobais().find(g => g.id === a.achadoFisicoId);
      return {
        id: a.id,
        localId: a.id,
        achadoFisicoId: a.achadoFisicoId,
        nomeAchado: a.nomeAchado || achadoGlobal?.nome || `Hallazgo #${a.achadoFisicoId}`,
        sistemaCategoria: achadoGlobal?.sistemaCategoria || '',
        presente: a.presente,
        textoDetalhe: a.textoDetalhe || '',
        destacado: a.destacado
      };
    });

    this.achadosCaso.set(achadosEdicao);
  }

  selecionarAba(aba: AbaFormulario): void {
    this.abaAtiva.set(aba);
    this.erro.set(null);
    this.sucesso.set(null);
  }

  toggleAcordeaoPerguntasCaso(): void {
    this.acordeaoPerguntasCasoAberto.update(v => !v);
  }

  toggleAcordeaoPerguntasGlobais(): void {
    this.acordeaoPerguntasGlobaisAberto.update(v => !v);
  }

  toggleAcordeaoAchadosGlobais(): void {
    this.acordeaoAchadosGlobaisAberto.update(v => !v);
  }

  toggleAcordeaoAchadosCaso(): void {
    this.acordeaoAchadosCasoAberto.update(v => !v);
  }

  atualizarRespostaGlobal(perguntaId: number, textoResposta: string): void {
    this.respostasGlobaisCaso.update(lista =>
      lista.map(item => item.perguntaId === perguntaId ? { ...item, textoResposta } : item)
    );
  }

  atualizarDestacadaGlobal(perguntaId: number, destacada: boolean): void {
    this.respostasGlobaisCaso.update(lista =>
      lista.map(item => item.perguntaId === perguntaId ? { ...item, destacada } : item)
    );
  }

  resetarRespostaGlobalParaPadrao(perguntaId: number): void {
    const pergunta = this.perguntasGlobais().find(p => p.id === perguntaId);
    if (!pergunta) return;

    this.atualizarRespostaGlobal(perguntaId, pergunta.respostaPadrao);
  }

  adicionarPerguntaCaso(): void {
    const texto = this.novaPerguntaCasoTexto().trim();
    const secao = this.novaPerguntaCasoSecao().trim();
    const categoria = this.novaPerguntaCasoCategoria().trim();
    const respostaPadrao = this.novaPerguntaCasoRespostaPadrao().trim();

    if (!texto || !secao || !categoria || !respostaPadrao) return;

    this.perguntasCaso.update(lista => [
      ...lista,
      {
        localId: this.contadorLocalPerguntaCaso--,
        texto,
        secao,
        categoria,
        respostaPadrao,
        ordemExibicao: this.novaPerguntaCasoOrdem(),
        ativo: this.novaPerguntaCasoAtiva()
      }
    ]);

    this.novaPerguntaCasoTexto.set('');
    this.novaPerguntaCasoRespostaPadrao.set('');
    this.novaPerguntaCasoOrdem.set(0);
    this.novaPerguntaCasoAtiva.set(true);
  }

  removerPerguntaCaso(localId: number): void {
    this.perguntasCaso.update(lista => lista.filter(p => p.localId !== localId));
  }

  usarAchadoGlobalNoCaso(achado: AchadoFisico): void {
    const existente = this.achadosCaso().find(a => a.achadoFisicoId === achado.id);
    if (existente) return;

    this.achadosCaso.update(lista => [
      ...lista,
      {
        localId: this.contadorLocalAchadoCaso--,
        achadoFisicoId: achado.id,
        nomeAchado: achado.nome,
        sistemaCategoria: achado.sistemaCategoria,
        presente: false,
        textoDetalhe: achado.resultadoPadrao,
        destacado: false
      }
    ]);
  }

  removerAchadoCaso(localId: number): void {
    this.achadosCaso.update(lista => lista.filter(a => a.localId !== localId));
  }

  selecionarNovoAchadoCaso(): void {
    const achadoId = this.novoAchadoCasoId();
    if (!achadoId) {
      this.novoAchadoCasoTextoDetalhe.set('');
      this.novoAchadoCasoPresente.set(false);
      this.novoAchadoCasoDestacado.set(false);
      return;
    }

    const achado = this.achadosGlobais().find(a => a.id === achadoId);
    if (!achado) return;

    this.novoAchadoCasoTextoDetalhe.set(achado.resultadoPadrao);
    this.novoAchadoCasoPresente.set(false);
    this.novoAchadoCasoDestacado.set(false);
  }

  adicionarAchadoCaso(): void {
    const achadoId = this.novoAchadoCasoId();
    if (!achadoId) return;

    const existente = this.achadosCaso().find(a => a.achadoFisicoId === achadoId);
    if (existente) return;

    const achado = this.achadosGlobais().find(a => a.id === achadoId);
    if (!achado) return;

    this.achadosCaso.update(lista => [
      ...lista,
      {
        localId: this.contadorLocalAchadoCaso--,
        achadoFisicoId: achado.id,
        nomeAchado: achado.nome,
        sistemaCategoria: achado.sistemaCategoria,
        presente: this.novoAchadoCasoPresente(),
        textoDetalhe: this.novoAchadoCasoTextoDetalhe().trim() || achado.resultadoPadrao,
        destacado: this.novoAchadoCasoDestacado()
      }
    ]);

    this.novoAchadoCasoId.set(null);
    this.novoAchadoCasoTextoDetalhe.set('');
    this.novoAchadoCasoPresente.set(false);
    this.novoAchadoCasoDestacado.set(false);
  }

  obterAchadoCasoPorAchadoGlobal(achadoFisicoId: number): AchadoCasoEdicao | undefined {
    return this.achadosCaso().find(a => a.achadoFisicoId === achadoFisicoId);
  }

  atualizarTextoAchadoCaso(localId: number, textoDetalhe: string): void {
    this.achadosCaso.update(lista =>
      lista.map(item => item.localId === localId ? { ...item, textoDetalhe } : item)
    );
  }

  resetarAchadoParaPadrao(localId: number): void {
    const achadoCaso = this.achadosCaso().find(a => a.localId === localId);
    if (!achadoCaso) return;

    const achadoGlobal = this.achadosGlobais().find(a => a.id === achadoCaso.achadoFisicoId);
    if (!achadoGlobal) return;

    this.atualizarTextoAchadoCaso(localId, achadoGlobal.resultadoPadrao);
  }

  async salvarTriagem(): Promise<void> {
    await this.executarSalvamento(async () => {
      await this.garantirCasoPersistido();
    }, 'Triagem guardada con éxito.');
  }

  async salvarAnamnesis(): Promise<void> {
    await this.executarSalvamento(async () => {
      const casoId = await this.garantirCasoPersistido();
      await this.sincronizarRespostasGlobais(casoId);
      await this.sincronizarPerguntasCaso(casoId);
      await this.carregarCasoCompleto(casoId);
    }, 'Anamnesis guardada con éxito.');
  }

  async salvarExameFisico(): Promise<void> {
    await this.executarSalvamento(async () => {
      const casoId = await this.garantirCasoPersistido();
      await this.sincronizarAchadosCaso(casoId);
      await this.carregarCasoCompleto(casoId);
    }, 'Examen físico guardado con éxito.');
  }

  private async executarSalvamento(acao: () => Promise<void>, mensagemSucesso: string): Promise<void> {
    this.salvando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    try {
      await acao();
      this.sucesso.set(mensagemSucesso);
    } catch (err: any) {
      this.erro.set(err?.mensagemAmigavel || 'Error al guardar el caso clínico.');
    } finally {
      this.salvando.set(false);
    }
  }

  private async garantirCasoPersistido(): Promise<number> {
    const casoSalvo = await this.salvarDadosCaso();

    if (!this.modoEdicao) {
      this.id.set(casoSalvo.id);
      await this.router.navigate(['/admin/casos', casoSalvo.id, 'editar'], { replaceUrl: true });
    }

    return casoSalvo.id;
  }

  private async salvarDadosCaso(): Promise<CasoClinico> {
    const dados: Partial<CasoClinico> = {
      titulo: this.titulo(),
      nomePaciente: this.nomePaciente(),
      idade: this.idade(),
      sexo: this.sexo(),
      queixaPrincipal: this.queixaPrincipal(),
      triagem: this.triagem(),
      resumo: this.resumo(),
      ativo: this.ativo()
    };

    return this.modoEdicao
      ? await firstValueFrom(this.casoService.atualizar(this.id()!, dados))
      : await firstValueFrom(this.casoService.criar(dados));
  }

  private async sincronizarRespostasGlobais(casoClinicoId: number): Promise<void> {
    const atuais = this.respostasGlobaisCaso();
    const originais = this.respostasGlobaisOriginais();
    const removidas = originais.filter(original => {
      const atual = atuais.find(r => r.perguntaId === original.perguntaId);
      if (!atual) return true;
      const respostaPadrao = this.obterRespostaPadraoPerguntaGlobal(atual.perguntaId);
      return atual.textoResposta.trim() === respostaPadrao.trim() && !atual.destacada;
    });

    for (const resposta of removidas) {
      await firstValueFrom(this.casoService.removerRespostaCaso(casoClinicoId, resposta.id));
    }

    for (const resposta of atuais) {
      const respostaPadrao = this.obterRespostaPadraoPerguntaGlobal(resposta.perguntaId);
      const devePersistir = resposta.textoResposta.trim() !== respostaPadrao.trim() || resposta.destacada;

      if (!devePersistir) {
        continue;
      }

      if (resposta.id) {
        await firstValueFrom(this.casoService.atualizarRespostaCaso(casoClinicoId, resposta.id, {
          textoResposta: resposta.textoResposta,
          destacada: resposta.destacada
        }));
      } else {
        await firstValueFrom(this.casoService.criarRespostaCaso(casoClinicoId, {
          perguntaId: resposta.perguntaId,
          textoResposta: resposta.textoResposta,
          destacada: resposta.destacada
        }));
      }
    }
  }

  private async sincronizarPerguntasCaso(casoClinicoId: number): Promise<void> {
    const atuais = this.perguntasCaso();
    const originais = this.perguntasCasoOriginais();

    const idsAtuais = new Set(atuais.filter(p => p.id).map(p => p.id!));
    const removidas = originais.filter(p => !idsAtuais.has(p.id));

    for (const pergunta of removidas) {
      await firstValueFrom(this.casoService.removerPerguntaCaso(casoClinicoId, pergunta.id));
    }

    for (const pergunta of atuais) {
      if (pergunta.id) {
        await firstValueFrom(this.casoService.atualizarPerguntaCaso(casoClinicoId, pergunta.id, {
          texto: pergunta.texto,
          secao: pergunta.secao,
          categoria: pergunta.categoria,
          respostaPadrao: pergunta.respostaPadrao,
          ordemExibicao: pergunta.ordemExibicao,
          ativo: pergunta.ativo
        }));
      } else {
        await firstValueFrom(this.casoService.criarPerguntaCaso(casoClinicoId, {
          texto: pergunta.texto,
          secao: pergunta.secao,
          categoria: pergunta.categoria,
          respostaPadrao: pergunta.respostaPadrao,
          ordemExibicao: pergunta.ordemExibicao,
          ativo: pergunta.ativo
        }));
      }
    }
  }

  private async sincronizarAchadosCaso(casoClinicoId: number): Promise<void> {
    const atuais = this.achadosCaso();
    const originais = this.achadosCasoOriginais();

    const idsAtuais = new Set(atuais.filter(a => a.id).map(a => a.id!));
    const removidos = originais.filter(a => !idsAtuais.has(a.id));

    for (const achado of removidos) {
      await firstValueFrom(this.casoService.removerAchadoFisicoCaso(casoClinicoId, achado.id));
    }

    for (const achado of atuais) {
      if (achado.id) {
        await firstValueFrom(this.casoService.atualizarAchadoFisicoCaso(casoClinicoId, achado.id, {
          presente: achado.presente,
          textoDetalhe: achado.textoDetalhe,
          destacado: achado.destacado
        }));
      } else {
        await firstValueFrom(this.casoService.criarAchadoFisicoCaso(casoClinicoId, {
          casoClinicoId,
          achadoFisicoId: achado.achadoFisicoId,
          presente: achado.presente,
          textoDetalhe: achado.textoDetalhe,
          destacado: achado.destacado
        }));
      }
    }
  }

  private obterTextoPerguntaGlobal(perguntaId: number): string {
    return this.perguntasGlobais().find(p => p.id === perguntaId)?.texto || `Pregunta #${perguntaId}`;
  }

  obterSecaoPerguntaGlobal(perguntaId: number): string {
    return this.perguntasGlobais().find(p => p.id === perguntaId)?.secao || '';
  }

  private obterRespostaPadraoPerguntaGlobal(perguntaId: number): string {
    return this.perguntasGlobais().find(p => p.id === perguntaId)?.respostaPadrao || '';
  }
}
