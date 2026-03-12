export interface ResultadoImportacao {
  sucesso: boolean;
  mensagemErro?: string | null;
  casoClinicoId?: number | null;
  avisosRevisao?: string[] | null;
}
