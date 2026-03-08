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
