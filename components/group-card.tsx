"use client"

import { Flame } from "lucide-react"
import type { Group, Team } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface GroupCardProps {
  group: Group
  teams: Team[]
  showCashout?: boolean
}

export function GroupCard({ group, teams, showCashout = true }: GroupCardProps) {
  // Ordenar por Cashout (Decrescente)
  const sortedTeams = [...group.teams].sort((a, b) => {
    if (b.cashout !== a.cashout) return b.cashout - a.cashout
    return a.position - b.position
  })

  // NOVAS CORES: Baseadas no chaveamento (Seed), não em eliminação
  const getPositionStyles = (index: number) => {
    const position = index + 1
    
    // 1º e 2º vão para Upper Bracket (Caminho "Melhor")
    if (position <= 2) {
      return {
        badge: "bg-blue-600 text-white", // Azul forte
        row: "border-blue-600/20 bg-blue-600/5", // Fundo levemente azulado
      }
    }
    
    // 3º e 4º vão para Lower Bracket (Caminho "Perigoso")
    return {
      badge: "bg-amber-600 text-white", // Laranja/Ambar
      row: "border-amber-600/20 bg-amber-600/5", // Fundo levemente alaranjado
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col h-full shadow-lg">
      {/* Cabeçalho do Grupo */}
      <div className="bg-zinc-800 px-4 py-3 flex items-center justify-between border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-500 fill-red-500" />
          <span className="font-bold text-white">{group.name}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
          Cashout Phase
        </span>
      </div>

      <div className="p-4 flex-1">
        {sortedTeams.length === 0 ? (
          <div className="h-full flex items-center justify-center min-h-[120px]">
            <p className="text-zinc-500 text-sm italic">Aguardando times...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTeams.map((gt, index) => {
              const teamName = gt.name || "Time Desconhecido"
              const teamLogo = gt.logo
              const styles = getPositionStyles(index)

              return (
                <div 
                  key={gt.teamId} 
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg border transition-colors",
                    styles.row
                  )}
                >
                  {/* Posição (Seed) */}
                  <span
                    className={cn(
                      "w-6 h-6 flex items-center justify-center rounded text-xs font-bold shadow-sm",
                      styles.badge
                    )}
                  >
                    {index + 1}
                  </span>

                  {/* Logo */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10">
                    {teamLogo ? (
                      <Image 
                        src={teamLogo} 
                        alt={teamName} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-500">
                        {teamName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Nome */}
                  <div className="flex-1 min-w-0">
                     <span className="font-bold text-white text-sm truncate block">
                        {teamName}
                     </span>
                     {/* Texto explicativo pequeno */}
                     <span className="text-[10px] text-zinc-400 block -mt-0.5">
                        {index < 2 ? "Upper Bracket" : "Lower Bracket"}
                     </span>
                  </div>

                  {/* Valor do Cashout */}
                  {showCashout && (
                    <div className="text-right">
                        <span className="block text-white font-mono text-sm font-bold">
                        ${gt.cashout.toLocaleString()}
                        </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}