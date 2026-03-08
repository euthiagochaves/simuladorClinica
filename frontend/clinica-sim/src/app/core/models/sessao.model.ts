import { CasoClinico } from './caso-clinico.model';

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
