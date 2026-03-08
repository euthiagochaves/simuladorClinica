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
