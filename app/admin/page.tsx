"use client"

import { useState } from "react"

export default function PreviewAdmin() {
  const [menuAtivo, setMenuAtivo] = useState("casos")

  const menuItems = [
    { id: "casos", label: "Casos Clínicos", icon: "📋" },
    { id: "perguntas", label: "Perguntas", icon: "❓" },
    { id: "achados", label: "Achados Físicos", icon: "🩺" },
    { id: "usuarios", label: "Usuários", icon: "👥" },
    { id: "importacao", label: "Importação YAML", icon: "📥" },
    { id: "config", label: "Configurações", icon: "⚙️" },
  ]

  const casos = [
    { id: 1, titulo: "Dor Torácica Aguda", paciente: "João Silva", triagem: "Urgente", ativo: true },
    { id: 2, titulo: "Cefaleia Persistente", paciente: "Maria Santos", triagem: "Prioritário", ativo: true },
    { id: 3, titulo: "Febre e Tosse", paciente: "Carlos Oliveira", triagem: "Normal", ativo: false },
    { id: 4, titulo: "Dor Abdominal", paciente: "Ana Costa", triagem: "Prioritário", ativo: true },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a5f7a] text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <a href="/" className="flex items-center gap-2 font-bold text-xl no-underline text-white">
            <span className="text-2xl">🏥</span>
            <span>ClinicaSim</span>
          </a>
          <p className="text-sm text-white/60 mt-1">Painel Administrativo</p>
        </div>
        <nav className="flex-1 p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setMenuAtivo(item.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-md mb-1 transition-colors ${
                menuAtivo === item.id
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center gap-2 text-white/70 hover:text-white no-underline text-sm">
            ← Voltar ao Início
          </a>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1a5f7a] mb-1">
                {menuItems.find((m) => m.id === menuAtivo)?.label}
              </h1>
              <p className="text-gray-600">Gerencie os casos clínicos do simulador</p>
            </div>
            <button className="px-4 py-2.5 bg-[#1a5f7a] text-white font-semibold rounded-md hover:bg-[#145069] transition-colors flex items-center gap-2">
              <span>+</span> Novo Caso
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Buscar casos..."
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]/30 focus:border-[#1a5f7a]"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]/30 focus:border-[#1a5f7a]">
              <option>Todas as Triagens</option>
              <option>Urgente</option>
              <option>Prioritário</option>
              <option>Normal</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]/30 focus:border-[#1a5f7a]">
              <option>Todos os Status</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Título</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Paciente</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Triagem</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {casos.map((caso) => (
                  <tr key={caso.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#1a5f7a]">{caso.titulo}</td>
                    <td className="px-6 py-4 text-gray-600">{caso.paciente}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                        caso.triagem === 'Urgente' ? 'bg-red-100 text-red-700' :
                        caso.triagem === 'Prioritário' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {caso.triagem}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                        caso.ativo ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {caso.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#2d9cdb] hover:text-[#1a5f7a] font-medium mr-3">Editar</button>
                      <button className="text-red-500 hover:text-red-700 font-medium">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>Mostrando 1-4 de 4 casos</span>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
              <button className="px-3 py-1.5 bg-[#1a5f7a] text-white rounded-md">1</button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Próximo</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
