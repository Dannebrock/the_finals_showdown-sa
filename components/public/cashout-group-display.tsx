"use client"

import { Flame } from "lucide-react"
import { TeamSlot } from "./team-slot"
import type { Group } from "@/lib/types"

interface CashoutGroupDisplayProps {
  group: Group
}

export function CashoutGroupDisplay({ group }: CashoutGroupDisplayProps) {
  const sortedTeams = [...group.teams].sort((a, b) => b.cashout - a.cashout)

  const getStatus = (index: number) => {
    if (group.locked) {
      if (index < 2) return "advanced"
      if (index < 4) return "lastChance"
      return "eliminated"
    }
    return "playing"
  }

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden min-w-[160px] sm:min-w-[250px] sm:min-h-[200px] w-full sm:w-auto">
      <div className="bg-red-600 text-white px-3 sm:px-4 py-2 font-bold flex items-center gap-2 text-sm sm:text-base">
        <Flame className="w-4 h-4" />
        {group.name}
      </div>
      <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
        {sortedTeams.length > 0 ? (
          sortedTeams.map((gt, index) => (
            <TeamSlot
              key={gt.teamId}
              teamId={gt.teamId}
              position={index + 1}
              status={getStatus(index)}
              cashout={gt.cashout}
              showCashout
              size="sm"
            />
          ))
        ) : (
          <div className="text-zinc-500 text-xs sm:text-sm text-center py-4 sm:py-6">Aguardando times...</div>
        )}
      </div>
    </div>
  )
}
