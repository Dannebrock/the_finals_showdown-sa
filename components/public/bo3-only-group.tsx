"use client"

import { Flame } from "lucide-react"
import { useTournament } from "@/components/tournament-context"
import { Bo3MatchDisplay } from "./bo3-match-display" // Importamos o componente inteligente
import type { Group } from "@/lib/types"

interface Bo3OnlyGroupProps {
  group: Group
}

export function Bo3OnlyGroup({ group }: Bo3OnlyGroupProps) {
  const { state } = useTournament()

  // Busca a partida real no banco de dados (que tem placar e status de vencedor)
  const match = state.bo3Matches.find((m) => m.sourceGroupId === group.id)

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden min-w-[180px] sm:min-w-[200px] shadow-lg">
      
      {/* Header Vermelho (Estilo G8) */}
      <div className="bg-red-600 text-white px-3 sm:px-4 py-2 font-bold flex items-center gap-2 text-sm sm:text-base">
        <Flame className="w-4 h-4" />
        {group.name}
      </div>

      {/* Corpo do Card */}
      <div className="p-4 flex justify-center bg-zinc-900">
        {match ? (
          // O Bo3MatchDisplay já sabe que se for G8, o vencedor é Amarelo e o perdedor é Vermelho
          <Bo3MatchDisplay match={match} label="Best of 3 - Ultima Vaga" />
        ) : (
          <div className="py-2 text-zinc-500 text-sm font-medium">
            Aguardando times...
          </div>
        )}
      </div>
    </div>
  )
}