"use client"

import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { Button } from "@/components/ui/button"
import { Swords, Plus, Minus, Crown, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export function Bo3Management() {
  const { state, updateBo3Match, setCurrentDay } = useTournament()
  const { teams, groups, bo3Matches, currentDay } = state

  const getTeam = (teamId: string | null) => (teamId ? teams.find((t) => t.id === teamId) : null)

  // Get matches for current day groups
  const dayGroupIds = groups.filter((g) => g.day === currentDay).map((g) => g.id)
  const dayMatches = bo3Matches.filter((m) => dayGroupIds.includes(m.sourceGroupId))

  // Group matches by source group
  const matchesByGroup: Record<string, typeof bo3Matches> = {}
  dayMatches.forEach((match) => {
    if (!matchesByGroup[match.sourceGroupId]) {
      matchesByGroup[match.sourceGroupId] = []
    }
    matchesByGroup[match.sourceGroupId].push(match)
  })

  const handleAddWin = (matchId: string, teamNumber: 1 | 2) => {
    const match = bo3Matches.find((m) => m.id === matchId)
    if (!match || match.completed) return

    if (teamNumber === 1) {
      updateBo3Match(matchId, { team1Wins: Math.min(match.team1Wins + 1, 2) })
    } else {
      updateBo3Match(matchId, { team2Wins: Math.min(match.team2Wins + 1, 2) })
    }
  }

  const handleRemoveWin = (matchId: string, teamNumber: 1 | 2) => {
    const match = bo3Matches.find((m) => m.id === matchId)
    if (!match) return

    if (teamNumber === 1) {
      updateBo3Match(matchId, {
        team1Wins: Math.max(match.team1Wins - 1, 0),
        winnerId: null,
        loserId: null,
        completed: false,
      })
    } else {
      updateBo3Match(matchId, {
        team2Wins: Math.max(match.team2Wins - 1, 0),
        winnerId: null,
        loserId: null,
        completed: false,
      })
    }
  }

  const getGroup = (groupId: string) => groups.find((g) => g.id === groupId)

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setCurrentDay(1)}
          className={cn(
            "px-6 py-3 font-bold",
            currentDay === 1
              ? "bg-amber-500 text-black hover:bg-amber-600"
              : "bg-zinc-800 text-white hover:bg-zinc-700",
          )}
        >
          Dia 1 - Sábado
        </Button>
        <Button
          onClick={() => setCurrentDay(2)}
          className={cn(
            "px-6 py-3 font-bold",
            currentDay === 2
              ? "bg-amber-500 text-black hover:bg-amber-600"
              : "bg-zinc-800 text-white hover:bg-zinc-700",
          )}
        >
          Dia 2 - Domingo
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-500" />
          Best of 3 - Gerenciamento
        </h3>
        <p className="text-sm text-zinc-400">
          Primeiro time a vencer 2 partidas avança. As partidas são criadas automaticamente ao fechar um grupo.
        </p>
      </div>

      {/* Matches by Group */}
      {Object.keys(matchesByGroup).length > 0 ? (
        Object.entries(matchesByGroup).map(([groupId, matches]) => {
          const group = getGroup(groupId)
          return (
            <div key={groupId} className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Partidas do {group?.name || groupId}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {matches.map((match) => {
                  const team1 = getTeam(match.team1Id)
                  const team2 = getTeam(match.team2Id)
                  const isComplete = match.completed

                  return (
                    <div
                      key={match.id}
                      className={cn(
                        "bg-zinc-900 rounded-lg border overflow-hidden",
                        isComplete ? "border-green-500" : "border-zinc-800",
                      )}
                    >
                      {/* Header */}
                      <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          Best of 3 - {match.matchType === "upper" ? "1º vs 2º" : "3º vs 4º"}
                        </span>
                        {isComplete && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Finalizada</span>
                        )}
                      </div>

                      {/* Match Content */}
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          {/* Team 1 */}
                          <div
                            className={cn(
                              "text-center p-3 rounded-lg transition-all",
                              match.winnerId === match.team1Id && "bg-green-500/20 ring-2 ring-green-500",
                            )}
                          >
                            <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden bg-zinc-700 mb-2">
                              {team1?.logo ? (
                                <Image
                                  src={team1.logo || "/placeholder.svg"}
                                  alt={team1.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-zinc-400">
                                  {team1?.name?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                            <p className="font-bold text-white text-sm mb-2 truncate">{team1?.name || "TBD"}</p>

                            {/* Win Counter */}
                            <div className="flex items-center justify-center gap-1 mb-2">
                              {[0, 1].map((i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-5 h-5 rounded-full border-2",
                                    i < match.team1Wins
                                      ? "bg-green-500 border-green-400"
                                      : "bg-zinc-700 border-zinc-600",
                                  )}
                                />
                              ))}
                            </div>

                            {/* Controls */}
                            {!isComplete && team1 && (
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 w-7 p-0 border-zinc-700 bg-transparent"
                                  onClick={() => handleRemoveWin(match.id, 1)}
                                  disabled={match.team1Wins === 0}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                                  onClick={() => handleAddWin(match.id, 1)}
                                  disabled={match.team1Wins >= 2}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Win
                                </Button>
                              </div>
                            )}

                            {match.winnerId === match.team1Id && (
                              <div className="flex items-center justify-center gap-1 mt-2 text-amber-400">
                                <Crown className="w-4 h-4" />
                                <span className="text-xs font-bold">Vencedor</span>
                              </div>
                            )}
                          </div>

                          {/* VS */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-zinc-500">
                              {match.team1Wins} - {match.team2Wins}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Primeiro a 2</p>
                          </div>

                          {/* Team 2 */}
                          <div
                            className={cn(
                              "text-center p-3 rounded-lg transition-all",
                              match.winnerId === match.team2Id && "bg-green-500/20 ring-2 ring-green-500",
                            )}
                          >
                            <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden bg-zinc-700 mb-2">
                              {team2?.logo ? (
                                <Image
                                  src={team2.logo || "/placeholder.svg"}
                                  alt={team2.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-zinc-400">
                                  {team2?.name?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                            <p className="font-bold text-white text-sm mb-2 truncate">{team2?.name || "TBD"}</p>

                            {/* Win Counter */}
                            <div className="flex items-center justify-center gap-1 mb-2">
                              {[0, 1].map((i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-5 h-5 rounded-full border-2",
                                    i < match.team2Wins
                                      ? "bg-green-500 border-green-400"
                                      : "bg-zinc-700 border-zinc-600",
                                  )}
                                />
                              ))}
                            </div>

                            {/* Controls */}
                            {!isComplete && team2 && (
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 w-7 p-0 border-zinc-700 bg-transparent"
                                  onClick={() => handleRemoveWin(match.id, 2)}
                                  disabled={match.team2Wins === 0}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                                  onClick={() => handleAddWin(match.id, 2)}
                                  disabled={match.team2Wins >= 2}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Win
                                </Button>
                              </div>
                            )}

                            {match.winnerId === match.team2Id && (
                              <div className="flex items-center justify-center gap-1 mt-2 text-amber-400">
                                <Crown className="w-4 h-4" />
                                <span className="text-xs font-bold">Vencedor</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <Swords className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">Nenhuma partida Bo3 ainda.</p>
          <p className="text-zinc-500 text-sm mt-2">
            Feche um grupo na aba "Grupos & Cashout" para criar partidas automaticamente.
          </p>
        </div>
      )}
    </div>
  )
}
