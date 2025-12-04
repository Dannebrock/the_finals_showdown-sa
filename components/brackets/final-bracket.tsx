"use client"

import type { Group, FinalMatch, Team } from "@/lib/types"
import { Trophy } from "lucide-react"

interface FinalBracketProps {
  group: Group
  finalMatch: FinalMatch | null
  getTeamById: (id: string) => Team | undefined
}

export function FinalBracket({ group, finalMatch, getTeamById }: FinalBracketProps) {
  const teams = finalMatch?.teams || group.teams.map((gt) => ({ teamId: gt.teamId, points: 0 }))

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden border-2 border-amber-500/50">
      {/* Header */}
      <div className="bg-amber-500 px-4 py-2 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-black" />
        <span className="font-bold text-black">{group.name}</span>
        <span className="ml-auto text-xs text-black/70">Primeiro a 5 pts</span>
      </div>

      {/* Teams */}
      <div className="divide-y divide-zinc-800">
        {teams.length === 0 ? (
          <div className="px-4 py-6 text-center text-zinc-500 text-sm">Aguardando finalistas...</div>
        ) : (
          teams.map((t, index) => {
            const team = getTeamById(t.teamId)
            if (!team) return null

            const isWinner = finalMatch?.winnerId === t.teamId

            return (
              <div key={t.teamId} className={`flex items-center px-3 py-3 gap-3 ${isWinner ? "bg-amber-500/20" : ""}`}>
                {/* Logo */}
                {team.logo ? (
                  <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-7 h-7 rounded object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                    {team.name.charAt(0)}
                  </div>
                )}

                {/* Name */}
                <span className={`flex-1 text-sm font-medium truncate ${isWinner ? "text-amber-400" : "text-white"}`}>
                  {team.name}
                </span>

                {/* Points */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded border ${
                        i < t.points ? "bg-amber-500 border-amber-400" : "bg-zinc-800 border-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                {isWinner && <Trophy className="w-5 h-5 text-amber-400" />}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
