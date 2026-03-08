import type {
  CasoClinico,
  Sessao,
  CriarSessaoRequest,
  RespostaInteracaoResponse,
  EventoSessao,
  NotaClinica,
  NotaClinicaRequest,
  Pergunta,
  AchadoFisico,
  Usuario,
  Configuracao,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Erro na requisição: ${response.status}`);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text);
}

// Casos Clínicos
export const casosApi = {
  listar: (somenteAtivos?: boolean) => {
    const params = somenteAtivos !== undefined ? `?somenteAtivos=${somenteAtivos}` : "";
    return fetchAPI<CasoClinico[]>(`/casos-clinicos${params}`);
  },
  buscarPorId: (id: number) => fetchAPI<CasoClinico>(`/casos-clinicos/${id}`),
  criar: (caso: Partial<CasoClinico>) =>
    fetchAPI<CasoClinico>("/casos-clinicos", {
      method: "POST",
      body: JSON.stringify(caso),
    }),
  atualizar: (id: number, caso: Partial<CasoClinico>) =>
    fetchAPI<CasoClinico>(`/casos-clinicos/${id}`, {
      method: "PUT",
      body: JSON.stringify(caso),
    }),
  excluir: (id: number) =>
    fetchAPI<void>(`/casos-clinicos/${id}`, { method: "DELETE" }),
};

// Sessões
export const sessoesApi = {
  criar: (request: CriarSessaoRequest) =>
    fetchAPI<Sessao>("/sessoes", {
      method: "POST",
      body: JSON.stringify(request),
    }),
  buscarPorId: (id: number) => fetchAPI<Sessao>(`/sessoes/${id}`),
  fazerPergunta: (sessaoId: number, perguntaId: number) =>
    fetchAPI<RespostaInteracaoResponse>(`/sessoes/${sessaoId}/perguntas`, {
      method: "POST",
      body: JSON.stringify({ perguntaId }),
    }),
  selecionarAchado: (sessaoId: number, achadoFisicoId: number) =>
    fetchAPI<RespostaInteracaoResponse>(`/sessoes/${sessaoId}/achados`, {
      method: "POST",
      body: JSON.stringify({ achadoFisicoId }),
    }),
  listarEventos: (sessaoId: number) =>
    fetchAPI<EventoSessao[]>(`/sessoes/${sessaoId}/eventos`),
  buscarNotaClinica: (sessaoId: number) =>
    fetchAPI<NotaClinica>(`/sessoes/${sessaoId}/nota-clinica`),
  salvarNotaClinica: (sessaoId: number, nota: NotaClinicaRequest) =>
    fetchAPI<NotaClinica>(`/sessoes/${sessaoId}/nota-clinica`, {
      method: "PUT",
      body: JSON.stringify(nota),
    }),
  finalizar: (sessaoId: number) =>
    fetchAPI<Sessao>(`/sessoes/${sessaoId}/finalizar`, { method: "POST" }),
};

// Perguntas
export const perguntasApi = {
  listar: (somenteAtivas?: boolean) => {
    const params = somenteAtivas !== undefined ? `?somenteAtivas=${somenteAtivas}` : "";
    return fetchAPI<Pergunta[]>(`/perguntas${params}`);
  },
  buscarPorId: (id: number) => fetchAPI<Pergunta>(`/perguntas/${id}`),
  criar: (pergunta: Partial<Pergunta>) =>
    fetchAPI<Pergunta>("/perguntas", {
      method: "POST",
      body: JSON.stringify(pergunta),
    }),
  atualizar: (id: number, pergunta: Partial<Pergunta>) =>
    fetchAPI<Pergunta>(`/perguntas/${id}`, {
      method: "PUT",
      body: JSON.stringify(pergunta),
    }),
  excluir: (id: number) =>
    fetchAPI<void>(`/perguntas/${id}`, { method: "DELETE" }),
};

// Achados Físicos
export const achadosApi = {
  listar: (somenteAtivos?: boolean) => {
    const params = somenteAtivos !== undefined ? `?somenteAtivos=${somenteAtivos}` : "";
    return fetchAPI<AchadoFisico[]>(`/achados-fisicos${params}`);
  },
  buscarPorId: (id: number) => fetchAPI<AchadoFisico>(`/achados-fisicos/${id}`),
  criar: (achado: Partial<AchadoFisico>) =>
    fetchAPI<AchadoFisico>("/achados-fisicos", {
      method: "POST",
      body: JSON.stringify(achado),
    }),
  atualizar: (id: number, achado: Partial<AchadoFisico>) =>
    fetchAPI<AchadoFisico>(`/achados-fisicos/${id}`, {
      method: "PUT",
      body: JSON.stringify(achado),
    }),
  excluir: (id: number) =>
    fetchAPI<void>(`/achados-fisicos/${id}`, { method: "DELETE" }),
};

// Usuários
export const usuariosApi = {
  listar: () => fetchAPI<Usuario[]>("/usuarios"),
  buscarPorId: (id: number) => fetchAPI<Usuario>(`/usuarios/${id}`),
  criar: (usuario: Partial<Usuario>) =>
    fetchAPI<Usuario>("/usuarios", {
      method: "POST",
      body: JSON.stringify(usuario),
    }),
  atualizar: (id: number, usuario: Partial<Usuario>) =>
    fetchAPI<Usuario>(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    }),
  excluir: (id: number) =>
    fetchAPI<void>(`/usuarios/${id}`, { method: "DELETE" }),
};

// Configurações
export const configuracoesApi = {
  buscar: () => fetchAPI<Configuracao[]>("/configuracoes"),
  salvar: (configuracoes: Configuracao[]) =>
    fetchAPI<Configuracao[]>("/configuracoes", {
      method: "PUT",
      body: JSON.stringify(configuracoes),
    }),
};

// Importação
export const importacaoApi = {
  importarYaml: async (arquivo: File) => {
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const response = await fetch(`${API_URL}/importacao/yaml`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `Erro na importação: ${response.status}`);
    }
    return response.json();
  },
};
