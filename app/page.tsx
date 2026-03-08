export default function PreviewInicio() {
  const casos = [
    {
      id: 1,
      titulo: "Dor Torácica Aguda",
      nomePaciente: "João Silva",
      idadePaciente: 58,
      sexoPaciente: "Masculino",
      queixaPrincipal: "Dor no peito há 2 horas, irradiando para braço esquerdo",
      triagem: "urgente"
    },
    {
      id: 2,
      titulo: "Cefaleia Persistente",
      nomePaciente: "Maria Santos",
      idadePaciente: 34,
      sexoPaciente: "Feminino",
      queixaPrincipal: "Dor de cabeça intensa há 3 dias, com náuseas",
      triagem: "prioritario"
    },
    {
      id: 3,
      titulo: "Febre e Tosse",
      nomePaciente: "Carlos Oliveira",
      idadePaciente: 45,
      sexoPaciente: "Masculino",
      queixaPrincipal: "Febre alta e tosse produtiva há 5 dias",
      triagem: "normal"
    },
    {
      id: 4,
      titulo: "Dor Abdominal",
      nomePaciente: "Ana Costa",
      idadePaciente: 28,
      sexoPaciente: "Feminino",
      queixaPrincipal: "Dor abdominal no quadrante inferior direito",
      triagem: "prioritario"
    }
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 h-16 bg-[#1a5f7a] text-white shadow-md">
        <a href="/" className="flex items-center gap-2 font-bold text-xl no-underline text-white">
          <span className="text-2xl">🏥</span>
          <span>ClinicaSim</span>
        </a>
        <div className="flex gap-6">
          <a href="/" className="text-white/85 no-underline font-medium px-2 py-1 rounded hover:text-white hover:bg-white/15 bg-white/20">Inicio</a>
          <a href="/admin" className="text-white/85 no-underline font-medium px-2 py-1 rounded hover:text-white hover:bg-white/15">Admin</a>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-gradient-to-br from-[#1a5f7a] to-[#2d9cdb] text-white py-12 px-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Bienvenido al Simulador Clínico</h1>
        <p className="text-lg opacity-90">Seleccione un caso clínico para iniciar la atención</p>
      </header>

      {/* Conteúdo */}
      <main className="max-w-[1100px] mx-auto p-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {casos.map((caso) => (
            <div
              key={caso.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 transition-shadow hover:shadow-lg"
            >
              <div className="flex-1">
                <h2 className="text-sm font-bold text-[#1a5f7a] mb-3 uppercase tracking-wide">
                  {caso.titulo}
                </h2>
                <div className="space-y-1.5 text-[15px] text-[#333]">
                  <p><span className="font-semibold text-[#555] mr-1">Paciente:</span>{caso.nomePaciente}</p>
                  <p><span className="font-semibold text-[#555] mr-1">Edad:</span>{caso.idadePaciente} años</p>
                  <p><span className="font-semibold text-[#555] mr-1">Sexo:</span>{caso.sexoPaciente}</p>
                  <p><span className="font-semibold text-[#555] mr-1">Motivo de consulta:</span>{caso.queixaPrincipal}</p>
                  <p>
                    <span className="font-semibold text-[#555] mr-1">Triaje:</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                      caso.triagem === 'urgente' ? 'bg-red-100 text-red-700' :
                      caso.triagem === 'prioritario' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {caso.triagem.charAt(0).toUpperCase() + caso.triagem.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              <a
                href="/atendimento"
                className="w-full py-2.5 px-5 bg-[#1a5f7a] text-white text-center font-semibold rounded-md hover:bg-[#145069] transition-colors no-underline"
              >
                Iniciar Atención →
              </a>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a5f7a] text-white/80 text-center py-4 text-sm">
        <p>ClinicaSim © 2026 - Plataforma de Simulación Clínica</p>
      </footer>
    </div>
  )
}
