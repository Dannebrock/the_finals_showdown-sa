"use client"

import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Plus, Minus, Crown, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function FinalManagement() {
  const { state, initFinalMatch, updateFinalPoints } = useTournament()
  const { teams, finalMatch } = state

  const [selectedTeams, setSelectedTeams] = useState<string[]>([])

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId)

  const handleAddTeamToFinal = (teamId: string) => {
    if (selectedTeams.length < 4 && !selectedTeams.includes(teamId)) {
      setSelectedTeams([...selectedTeams, teamId])
    }
  }

  const handleRemoveTeamFromSelection = (teamId: string) => {
    setSelectedTeams(selectedTeams.filter((id) => id !== teamId))
  }

  const handleStartFinal = () => {
    if (selectedTeams.length >= 2) {
      initFinalMatch(selectedTeams)
    }
  }

  const handleAddPoint = (teamId: string) => {
    if (!finalMatch) return
    const currentTeam = finalMatch.teams.find((t) => t.teamId === teamId)
    if (currentTeam && currentTeam.points < 5) {
      updateFinalPoints(teamId, currentTeam.points + 1)
    }
  }

  const handleRemovePoint = (teamId: string) => {
    if (!finalMatch) return
    const currentTeam = finalMatch.teams.find((t) => t.teamId === teamId)
    if (currentTeam && currentTeam.points > 0) {
      updateFinalPoints(teamId, currentTeam.points - 1)
    }
  }

  const availableTeams = teams.filter((t) => !selectedTeams.includes(t.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 text-center">
        <Trophy className="w-12 h-12 text-black mx-auto mb-2" />
        <h2 className="text-2xl font-black text-black">THE FINAL</h2>
        <p className="text-black/70 font-medium">Primeiro a atingir 5 pontos vence!</p>
      </div>

      {!finalMatch ? (
        // Setup Final
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Configurar Final
          </h3>

          {/* Team Selection */}
          <div className="space-y-4">
            <Select onValueChange={handleAddTeamToFinal} disabled={selectedTeams.length >= 4}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Adicionar time à final..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {availableTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id} className="text-white hover:bg-zinc-700">
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Teams */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedTeams.map((teamId) => {
                const team = getTeam(teamId)
                if (!team) return null
                return (
                  <div key={teamId} className="bg-zinc-800 rounded-lg p-3 text-center relative">
                    <button
                      onClick={() => handleRemoveTeamFromSelection(teamId)}
                      className="absolute top-1 right-1 text-zinc-400 hover:text-red-500 text-xs"
                    >
                      ✕
                    </button>
                    <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden bg-zinc-700 mb-2">
                      {team.logo ? (
                        <Image src={team.logo || "/placeholder.svg"} alt={team.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-zinc-400">
                          {team.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium truncate">{team.name}</p>
                  </div>
                )
              })}
            </div>

            <Button
              onClick={handleStartFinal}
              disabled={selectedTeams.length < 2}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Iniciar Final ({selectedTeams.length}/4 times)
            </Button>
          </div>
        </div>
      ) : (
        // Final Match
        <div className="bg-zinc-900 rounded-lg border border-amber-500/50 overflow-hidden">
          <div className="bg-zinc-800 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-bold">G13 - Final</span>
            {finalMatch.completed && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Finalizada!</span>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {finalMatch.teams.map((ft) => {
                const team = getTeam(ft.teamId)
                const isWinner = finalMatch.winnerId === ft.teamId

                return (
                  <div
                    key={ft.teamId}
                    className={cn(
                      "text-center p-4 rounded-lg transition-all",
                      isWinner && "bg-amber-500/20 ring-2 ring-amber-500",
                    )}
                  >
                    <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-zinc-700 mb-3">
                      {team?.logo ? (
                        <Image
                          src={team.logo || "/placeholder.svg"}
                          alt={team?.name || ""}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-400">
                          {team?.name?.charAt(0)}
                        </div>
                      )}
                    </div>

                    <p className="font-bold text-white mb-2">{team?.name}</p>

                    {/* Points */}
                    <div className="text-4xl font-black text-amber-500 mb-3">{ft.points}</div>

                    {/* Point Indicators */}
                    <div className="flex justify-center gap-1 mb-3">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={cn("w-3 h-3 rounded-full", i < ft.points ? "bg-amber-500" : "bg-zinc-700")}
                        />
                      ))}
                    </div>

                    {/* Controls */}
                    {!finalMatch.completed && (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-zinc-700 bg-transparent"
                          onClick={() => handleRemovePoint(ft.teamId)}
                          disabled={ft.points === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-black"
                          onClick={() => handleAddPoint(ft.teamId)}
                          disabled={ft.points >= 5}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ponto
                        </Button>
                      </div>
                    )}

                    {isWinner && (
                      <div className="flex items-center justify-center gap-1 mt-3 text-amber-400">
                        <Crown className="w-5 h-5" />
                        <span className="font-bold">CAMPEÃO!</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
        <h3 className="font-bold text-white mb-2">Como funciona a Final:</h3>
        <ul className="text-sm text-zinc-400 space-y-1">
          <li>• O formato da final é diferente: primeiro a 5 pontos vence</li>
          <li>• Cada vitória em uma partida de Cashout vale 1 ponto</li>
          <li>• Após cada ciclo de Cashout, 1º e 2º jogam Bo3</li>
          <li>• Vencedor do Bo3 ganha +1 ponto acumulado</li>
          <li>• O processo continua até alguém atingir 5 pontos</li>
        </ul>
      </div>
    </div>
  )
}
