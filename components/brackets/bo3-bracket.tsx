"use client"

import type { Bo3Match, Team } from "@/lib/types"

interface Bo3BracketProps {
  title: string
  matches: Bo3Match[]
  getTeamById: (id: string) => Team | undefined
}

export function Bo3Bracket({ title, matches, getTeamById }: Bo3BracketProps) {
  if (matches.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
        <div className="text-sm text-zinc-500 mb-2">{title}</div>
        <div className="text-center text-zinc-500 text-sm py-4">Aguardando times...</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => {
        const team1 = match.team1Id ? getTeamById(match.team1Id) : null
        const team2 = match.team2Id ? getTeamById(match.team2Id) : null

        return (
          <div key={match.id} className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="text-xs text-zinc-500 px-3 py-1 border-b border-zinc-800">Best of 3</div>
            <div className="divide-y divide-zinc-800">
              {/* Team 1 */}
              <div
                className={`flex items-center px-3 py-2 gap-3 ${match.winnerId === match.team1Id ? "bg-green-500/10" : ""}`}
              >
                {team1?.logo ? (
                  <img
                    src={team1.logo || "/placeholder.svg"}
                    alt={team1.name}
                    className="w-5 h-5 rounded object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                    ?
                  </div>
                )}
                <span
                  className={`flex-1 text-sm truncate ${match.winnerId === match.team1Id ? "text-green-400 font-bold" : "text-white"}`}
                >
                  {team1?.name || "TBD"}
                </span>
                <span className="text-sm font-bold text-white">{match.team1Wins}</span>
              </div>

              {/* Team 2 */}
              <div
                className={`flex items-center px-3 py-2 gap-3 ${match.winnerId === match.team2Id ? "bg-green-500/10" : ""}`}
              >
                {team2?.logo ? (
                  <img
                    src={team2.logo || "/placeholder.svg"}
                    alt={team2.name}
                    className="w-5 h-5 rounded object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                    ?
                  </div>
                )}
                <span
                  className={`flex-1 text-sm truncate ${match.winnerId === match.team2Id ? "text-green-400 font-bold" : "text-white"}`}
                >
                  {team2?.name || "TBD"}
                </span>
                <span className="text-sm font-bold text-white">{match.team2Wins}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
