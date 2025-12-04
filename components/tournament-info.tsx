import { Gamepad2, FileText, Map } from "lucide-react"

export function TournamentInfo() {
  return (
    <div className="w-full bg-[#1a1a1a]">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Gamepad2 className="w-4 h-4" />
              <span>Modo de Jogo</span>
            </div>
            <p className="text-white font-medium">World Tour Ranked</p>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <FileText className="w-4 h-4" />
              <span>Regras</span>
            </div>
            <p className="text-white font-medium">Todas as classes, armas e habilidades permitidas</p>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Map className="w-4 h-4" />
              <span>Mapas</span>
            </div>
            <p className="text-white font-medium">Sorteio + Seleção de times</p>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm">
            <span className="text-red-500 font-medium">Formato:</span>{" "}
            <span className="text-zinc-400">4 grupos de 4 cada (16 times total)</span>
          </p>
          <p className="text-sm">
            <span className="text-red-500 font-medium">Partidas:</span>{" "}
            <span className="text-zinc-400">Cashout + Best of 3 (final: primeiro a 5 pontos)</span>
          </p>
        </div>
      </div>
    </div>
  )
}
