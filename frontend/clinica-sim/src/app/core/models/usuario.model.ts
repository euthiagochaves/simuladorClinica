export interface Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  perfil: string;
  ativo: boolean;
  criadoEm?: string;
}
