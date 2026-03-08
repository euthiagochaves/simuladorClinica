export interface CasoClinico {
  id: number;
  titulo: string;
  nomePaciente: string;
  idade: number;
  sexo: string;
  queixaPrincipal: string;
  triagem?: string;
  resumo?: string;
  ativo: boolean;
  criadoEm?: string;
}
