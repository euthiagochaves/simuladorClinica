export interface RespostaCaso {
  id: number;
  casoClinicoId: number;
  perguntaId: number;
  textoResposta: string;
  destacada: boolean;
  textoPergunta?: string;
}

export interface CriarRespostaCasoRequest {
  perguntaId: number;
  textoResposta: string;
  destacada: boolean;
}

export interface AtualizarRespostaCasoRequest {
  textoResposta: string;
  destacada: boolean;
}
