export interface AchadoCaso {
  id: number;
  casoClinicoId: number;
  achadoFisicoId: number;
  presente: boolean;
  textoDetalhe?: string;
  destacado: boolean;
  nomeAchado?: string;
}

export interface CriarAchadoCasoRequest {
  casoClinicoId: number;
  achadoFisicoId: number;
  presente: boolean;
  textoDetalhe?: string;
  destacado: boolean;
}

export interface AtualizarAchadoCasoRequest {
  presente: boolean;
  textoDetalhe?: string;
  destacado: boolean;
}
