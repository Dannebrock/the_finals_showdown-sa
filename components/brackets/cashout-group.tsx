"use client"

import type { Group, Team } from "@/lib/types"
import { Flame, DollarSign } from "lucide-react"

interface CashoutGroupProps {
  group: Group
  getTeamById: (id: string) => Team | undefined
}

const positionColors: Record<number, string> = {
  1: "bg-green-500", // 1st - Advanced
  2: "bg-sky-500", // 2nd - Playing / One more chance
  3: "bg-orange-500", // 3rd - Last chance
  4: "bg-red-600", // 4th - Eliminated
}

const statusBgColors: Record<string, string> = {
  playing: "bg-sky-500",
  advanced: "bg-green-500",
  lastChance: "bg-orange-500",
  eliminated: "bg-red-600",
}

export function CashoutGroup({ group, getTeamById }: CashoutGroupProps) {
  // Sort teams by cashout (descending)
  const sortedTeams = [...group.teams].sort((a, b) => (b.cashout || 0) - (a.cashout || 0))

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
      {/* Header */}
      <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
        <Flame className="w-4 h-4 text-white" />
        <span className="font-bold text-white">{group.name}</span>
        {group.type === "cashout" && (
          <span className="ml-auto text-xs text-white/80 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Cashout
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="divide-y divide-zinc-800">
        {sortedTeams.length === 0 ? (
          <div className="px-4 py-6 text-center text-zinc-500 text-sm">Aguardando times...</div>
        ) : (
          sortedTeams.map((gt, index) => {
            const team = getTeamById(gt.teamId)
            if (!team) return null

            const position = index + 1
            const bgColor = statusBgColors[gt.status] || positionColors[position] || "bg-zinc-700"
            const cashoutValue = gt.cashout ?? 0

            return (
              <div key={gt.teamId} className="flex items-center px-3 py-2 gap-3">
                {/* Position */}
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${bgColor}`}
                >
                  {position}
                </div>

                {/* Logo */}
                {team.logo ? (
                  <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-8 h-8 rounded object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                    {team.name.charAt(0)}
                  </div>
                )}

                {/* Name */}
                <span className="flex-1 text-sm text-white font-medium truncate">{team.name}</span>

                <span className="text-sm text-zinc-400 font-mono">${cashoutValue.toLocaleString()}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
