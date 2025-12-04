"use client"

import { Flame } from "lucide-react"
import { useTournament } from "@/components/tournament-context"
import type { Group } from "@/lib/types"

interface Bo3OnlyGroupProps {
  group: Group
}

export function Bo3OnlyGroup({ group }: Bo3OnlyGroupProps) {
  const { state } = useTournament()

  const team1 = group.teams[0]
  const team2 = group.teams[1]

  const getTeamInfo = (teamId: string | undefined) => {
    if (!teamId) return null
    return state.teams.find((t) => t.id === teamId)
  }

  const team1Info = getTeamInfo(team1?.teamId)
  const team2Info = getTeamInfo(team2?.teamId)

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
      {/* G8 Bo3 Card */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden min-w-[180px] sm:min-w-[200px]">
        <div className="bg-red-600 text-white px-3 sm:px-4 py-2 font-bold flex items-center gap-2 text-sm sm:text-base">
          <Flame className="w-4 h-4" />
          {group.name} best of 3
        </div>
        <div className="p-3 space-y-2">
          {team1Info ? (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded ${
                team1?.status === "advanced"
                  ? "bg-teal-600"
                  : team1?.status === "eliminated"
                    ? "bg-red-600"
                    : "bg-zinc-700"
              }`}
            >
              {team1Info.logo && (
                <img src={team1Info.logo || "/placeholder.svg"} alt="" className="w-6 h-6 rounded object-cover" />
              )}
              <span className="text-white font-medium text-sm">{team1Info.name}</span>
            </div>
          ) : (
            <div className="bg-zinc-800 rounded px-3 py-2 text-zinc-500 text-sm">Aguardando...</div>
          )}
          {team2Info ? (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded ${
                team2?.status === "advanced"
                  ? "bg-teal-600"
                  : team2?.status === "eliminated"
                    ? "bg-red-600"
                    : "bg-zinc-700"
              }`}
            >
              {team2Info.logo && (
                <img src={team2Info.logo || "/placeholder.svg"} alt="" className="w-6 h-6 rounded object-cover" />
              )}
              <span className="text-white font-medium text-sm">{team2Info.name}</span>
            </div>
          ) : (
            <div className="bg-zinc-800 rounded px-3 py-2 text-zinc-500 text-sm">Aguardando...</div>
          )}
        </div>
      </div>

      {/* Winner indicator */}
      {group.locked && (team1?.status === "advanced" || team2?.status === "advanced") && (
        <>
          <div className="hidden sm:flex flex-col justify-center h-full py-8">
            <div className="w-8 border-t-2 border-zinc-700" />
          </div>
          <div className="bg-teal-600 rounded-lg px-4 py-3">
            <span className="text-white font-bold text-sm">
              {team1?.status === "advanced" ? team1Info?.name : team2Info?.name}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
