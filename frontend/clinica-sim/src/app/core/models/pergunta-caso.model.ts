export interface PerguntaCaso {
  id: number;
  casoClinicoId: number;
  texto: string;
  secao: string;
  categoria: string;
  respostaPadrao: string;
  ativo: boolean;
  ordemExibicao: number;
}

export interface CriarPerguntaCasoRequest {
  texto: string;
  secao: string;
  categoria: string;
  respostaPadrao: string;
  ordemExibicao?: number;
  ativo?: boolean;
}

export interface AtualizarPerguntaCasoRequest {
  texto: string;
  secao: string;
  categoria: string;
  respostaPadrao: string;
  ordemExibicao: number;
  ativo: boolean;
}
