export interface Pergunta {
  id: number;
  texto: string;
  secao: string;
  categoria: string;
  respostaPadrao: string;
  ativo: boolean;
  ordemExibicao?: number;
}
