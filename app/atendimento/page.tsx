"use client"

import { useState } from "react"

export default function PreviewAtendimento() {
  const [abaAtiva, setAbaAtiva] = useState<"anamnese" | "exame" | "historia">("anamnese")

  const sessao = {
    codigo: "SES-2026-0042",
    paciente: {
      nome: "João Silva",
      idade: 58,
      sexo: "Masculino",
      peso: "82 kg",
      altura: "1.75 m"
    },
    queixaPrincipal: "Dor no peito há 2 horas, irradiando para braço esquerdo",
    triagem: "Urgente"
  }

  const eventos = [
    { tipo: "sistema", texto: "Sessão iniciada. Paciente aguardando atendimento." },
    { tipo: "medico", texto: "Olá, senhor João. Pode me contar o que está sentindo?" },
    { tipo: "paciente", texto: "Doutor, estou com uma dor muito forte no peito há umas 2 horas. Parece que está apertando e vai até o braço esquerdo." },
    { tipo: "medico", texto: "A dor começou de repente ou foi gradual?" },
    { tipo: "paciente", texto: "Começou de repente, enquanto eu estava subindo as escadas do prédio." },
  ]

  const perguntas = [
    { id: 1, texto: "Há quanto tempo sente essa dor?", categoria: "HDA" },
    { id: 2, texto: "A dor é constante ou intermitente?", categoria: "HDA" },
    { id: 3, texto: "Tem alguma doença crônica?", categoria: "HPP" },
    { id: 4, texto: "Usa alguma medicação?", categoria: "HPP" },
    { id: 5, texto: "Tem histórico de doenças cardíacas na família?", categoria: "HF" },
  ]

  const achados = [
    { id: 1, nome: "Pressão Arterial", regiao: "Geral" },
    { id: 2, nome: "Frequência Cardíaca", regiao: "Geral" },
    { id: 3, nome: "Ausculta Cardíaca", regiao: "Tórax" },
    { id: 4, nome: "Ausculta Pulmonar", regiao: "Tórax" },
    { id: 5, nome: "Palpação Abdominal", regiao: "Abdome" },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      {/* Navbar do Atendimento */}
      <nav className="bg-[#1a5f7a] text-white px-8 h-14 flex items-center gap-4 shrink-0">
        <span className="font-bold text-lg">🏥 ClinicaSim</span>
        <span className="flex-1 text-center text-sm opacity-85">Sesión: {sessao.codigo}</span>
        <a href="/" className="px-4 py-1.5 bg-white/20 text-white rounded-md font-semibold text-sm hover:bg-white/30 transition-colors no-underline">
          ← Volver
        </a>
      </nav>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-4 max-w-[1400px] w-full mx-auto">
        {/* Info do Paciente */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-wrap gap-6">
          <div>
            <span className="text-xs font-semibold text-[#555] uppercase tracking-wide">Paciente</span>
            <p className="font-bold text-[#1a5f7a]">{sessao.paciente.nome}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#555] uppercase tracking-wide">Edad</span>
            <p>{sessao.paciente.idade} años</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#555] uppercase tracking-wide">Sexo</span>
            <p>{sessao.paciente.sexo}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#555] uppercase tracking-wide">Peso</span>
            <p>{sessao.paciente.peso}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#555] uppercase tracking-wide">Altura</span>
            <p>{sessao.paciente.altura}</p>
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-[#555] uppercase tracking-wide">Motivo</span>
            <p>{sessao.queixaPrincipal}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#555] uppercase tracking-wide">Triaje</span>
            <p className="inline-block px-2.5 py-0.5 rounded-full text-sm font-semibold bg-red-100 text-red-700">{sessao.triagem}</p>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
          {/* Coluna do Chat */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-[#555] uppercase tracking-wide m-0">Chat Clínico</h3>
            <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col min-h-[400px]">
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {eventos.map((evento, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      evento.tipo === "sistema"
                        ? "bg-gray-100 text-gray-600 text-sm italic mx-auto text-center max-w-full"
                        : evento.tipo === "medico"
                        ? "bg-[#1a5f7a] text-white ml-auto"
                        : "bg-[#e3f2fd] text-[#333]"
                    }`}
                  >
                    {evento.tipo !== "sistema" && (
                      <span className="text-xs font-semibold opacity-70 block mb-1">
                        {evento.tipo === "medico" ? "Médico" : "Paciente"}
                      </span>
                    )}
                    {evento.texto}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Escriba su pregunta..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]/30 focus:border-[#1a5f7a]"
                />
                <button className="px-4 py-2 bg-[#1a5f7a] text-white rounded-md font-semibold hover:bg-[#145069] transition-colors">
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* Coluna do Painel */}
          <div className="bg-white rounded-lg shadow-md flex flex-col">
            {/* Abas */}
            <div className="flex border-b-2 border-gray-200">
              {[
                { id: "anamnese", label: "Anamnesis" },
                { id: "exame", label: "Ex. Físico" },
                { id: "historia", label: "H. Clínica" },
              ].map((aba) => (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id as "anamnese" | "exame" | "historia")}
                  className={`flex-1 py-3 px-2 font-semibold text-sm border-b-[3px] -mb-[2px] transition-colors ${
                    abaAtiva === aba.id
                      ? "text-[#1a5f7a] border-[#1a5f7a]"
                      : "text-gray-500 border-transparent hover:text-[#1a5f7a]"
                  }`}
                >
                  {aba.label}
                </button>
              ))}
            </div>

            {/* Conteúdo da Aba */}
            <div className="p-4 flex-1 overflow-y-auto">
              {abaAtiva === "anamnese" && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">Seleccione una pregunta para realizar al paciente:</p>
                  {perguntas.map((p) => (
                    <button
                      key={p.id}
                      className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-[#1a5f7a] hover:bg-[#f0f9ff] transition-colors"
                    >
                      <span className="text-xs font-semibold text-[#2d9cdb] mr-2">[{p.categoria}]</span>
                      {p.texto}
                    </button>
                  ))}
                </div>
              )}

              {abaAtiva === "exame" && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">Seleccione un examen físico para realizar:</p>
                  {achados.map((a) => (
                    <button
                      key={a.id}
                      className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-[#1a5f7a] hover:bg-[#f0f9ff] transition-colors"
                    >
                      <span className="text-xs font-semibold text-[#27ae60] mr-2">[{a.regiao}]</span>
                      {a.nome}
                    </button>
                  ))}
                </div>
              )}

              {abaAtiva === "historia" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Complete a história clínica do paciente:</p>
                  <div>
                    <label className="block text-sm font-semibold text-[#555] mb-1">Hipótese Diagnóstica</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]/30 focus:border-[#1a5f7a] min-h-[80px]"
                      placeholder="Digite sua hipótese diagnóstica..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#555] mb-1">Conduta</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]/30 focus:border-[#1a5f7a] min-h-[80px]"
                      placeholder="Digite a conduta recomendada..."
                    />
                  </div>
                  <button className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                    Finalizar Atendimento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
