export interface DiagnosticoDiferencial {
  ordemPrioridade: number;
  textoDiagnostico: string;
}

export interface NotaClinica {
  id?: number;
  textoResumo: string;
  textoDiagnosticoProvavel: string;
  textoConduta: string;
  diagnosticosDiferenciais: DiagnosticoDiferencial[];
  criadoEm?: string;
}

export interface NotaClinicaRequest {
  textoResumo: string;
  textoDiagnosticoProvavel: string;
  textoConduta: string;
  diagnosticosDiferenciais: DiagnosticoDiferencial[];
}
