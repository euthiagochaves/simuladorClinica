export interface CasoClinico {
  id: number;
  titulo: string;
  nomePaciente: string;
  idadePaciente: number;
  sexoPaciente: string;
  queixaPrincipal: string;
  triagem: string;
  ativo: boolean;
  descricao?: string;
  historiaDoenca?: string;
  antecedentesPatologicos?: string;
  diagnosticoFinal?: string;
}
