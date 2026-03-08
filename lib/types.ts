// Caso Clínico
export interface CasoClinico {
  id: number;
  titulo: string;
  nomePaciente: string;
  idadePaciente: number;
  sexoPaciente: string;
  queixaPrincipal: string;
  triagem: string;
  ativo: boolean;
  descricao?: string;
  historiaDoenca?: string;
  antecedentesPatologicos?: string;
  diagnosticoFinal?: string;
}

// Sessão
export interface Sessao {
  id: number;
  codigo: string;
  casoClinicoId: number;
  casoClinico?: CasoClinico;
  alunoId?: number;
  dataInicio: string;
  dataFim?: string;
  status: string;
}

export interface CriarSessaoRequest {
  casoClinicoId: number;
  alunoId?: number | null;
}

export interface RespostaInteracaoResponse {
  textoExibido: string;
  textoResposta: string;
  segundosDesdeInicio: number;
  tipo: string;
}

// Evento Sessão
export interface EventoSessao {
  id: number;
  sessaoId: number;
  tipo: string;
  descricaoPergunta?: string;
  descricaoResposta?: string;
  textoExibido: string;
  textoResposta: string;
  segundosDesdeInicio: number;
  dataHora: string;
}

// Nota Clínica
export interface DiagnosticoDiferencial {
  ordemPrioridade: number;
  textoDiagnostico: string;
}

export interface NotaClinica {
  id?: number;
  sessaoId: number;
  textoResumo: string;
  textoDiagnosticoProvavel: string;
  textoConduta: string;
  diagnosticosDiferenciais: DiagnosticoDiferencial[];
}

export interface NotaClinicaRequest {
  textoResumo: string;
  textoDiagnosticoProvavel: string;
  textoConduta: string;
  diagnosticosDiferenciais: DiagnosticoDiferencial[];
}

// Pergunta
export interface Pergunta {
  id: number;
  textoPergunta: string;
  categoria: string;
  ativa: boolean;
}

// Achado Físico
export interface AchadoFisico {
  id: number;
  nomeAchado: string;
  sistemaCategoria: string;
  ativo: boolean;
}

// Usuário
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
}

// Configurações
export interface Configuracao {
  id?: number;
  chave: string;
  valor: string;
}
