import { CasoClinico } from './caso-clinico.model';

export interface Sessao {
  id: number;
  codigoSessao: string;
  casoClinicoId: number;
  casoClinico?: CasoClinico;
  alunoId?: number;
  iniciadoEm: string;
  finalizadoEm?: string;
  status: string;
}

export interface CriarSessaoRequest {
  casoClinicoId: number;
  alunoId?: number | null;
}

export interface RespostaInteracaoResponse {
  tipoEvento: string;
  textoExibido: string;
  textoResposta: string;
  segundosDesdeInicio: number;
}
