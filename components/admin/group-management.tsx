"use client"

import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flame, Lock, Trash2, DollarSign, Unlock } from "lucide-react"
import { cn } from "@/lib/utils"

export function GroupManagement() {
  const {
    state,
    setCurrentDay,
    addTeamToGroup,
    removeTeamFromGroup,
    updateTeamCashout,
    lockGroupAndCreateBo3,
    updateGroup,
  } = useTournament()
  const { teams, groups, currentDay } = state

  const dayGroups = groups.filter((g) => g.day === currentDay && g.type === "cashout")

  // Get teams not assigned to any group
  const assignedTeamIds = groups.flatMap((g) => g.teams.map((t) => t.teamId))
  const availableTeams = teams.filter((t) => !assignedTeamIds.includes(t.id))

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId)

  const handleAddTeamToGroup = (groupId: string, teamId: string) => {
    if (teamId) {
      addTeamToGroup(groupId, teamId, 0)
    }
  }

  const handleCashoutChange = (groupId: string, teamId: string, value: string) => {
    const cashout = Number.parseInt(value) || 0
    updateTeamCashout(groupId, teamId, cashout)
  }

  const handleLockGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return

    if (group.locked) {
      // Unlock - just toggle the lock
      updateGroup(groupId, { locked: false })
    } else {
      // Lock and create Bo3 matches
      lockGroupAndCreateBo3(groupId)
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-amber-500" // Green for 1st - advances
      case 2:
        return "bg-teal-500" // Teal for 2nd - advances
      case 3:
        return "bg-teal-500" // Teal for 3rd - last chance
      case 4:
        return "bg-red-600" // Red for 4th - last chance
      default:
        return "bg-zinc-600"
    }
  }

  // Group by phase
  const phases = [...new Set(dayGroups.map((g) => g.phase))]

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
        <h3 className="font-bold text-white mb-2">Como usar:</h3>
        <ul className="text-sm text-zinc-400 space-y-1">
          <li>1. Adicione times ao grupo usando o seletor</li>
          <li>2. Insira o valor de Cashout (dinheiro extraído) para cada time</li>
          <li>3. Clique em "Fechar Grupo" para criar automaticamente as partidas Bo3</li>
          <li>4. Times são ordenados por Cashout: 1º vs 2º joga Bo3, 3º vs 4º joga Bo3</li>
        </ul>
      </div>

      {phases.map((phase) => (
        <div key={phase} className="space-y-4">
          <h3 className="text-xl font-bold text-white border-l-4 border-amber-500 pl-4">{phase}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dayGroups
              .filter((g) => g.phase === phase)
              .map((group) => (
                <div key={group.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                  {/* Group Header */}
                  <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-white" />
                      <span className="font-bold text-white text-lg">{group.name}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">Cashout</span>
                    </div>
                    <Button
                      variant={group.locked ? "destructive" : "secondary"}
                      size="sm"
                      className={cn(
                        "h-8 text-xs font-bold",
                        group.locked
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-amber-500 hover:bg-amber-600 text-black",
                      )}
                      onClick={() => handleLockGroup(group.id)}
                      disabled={!group.locked && group.teams.length < 4}
                    >
                      {group.locked ? (
                        <>
                          <Unlock className="w-3 h-3 mr-1" />
                          Desbloquear
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Fechar Grupo
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Add Team Select */}
                  {!group.locked && (
                    <div className="p-4 border-b border-zinc-800">
                      <Select
                        onValueChange={(value) => handleAddTeamToGroup(group.id, value)}
                        disabled={group.teams.length >= 4}
                      >
                        <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue
                            placeholder={group.teams.length >= 4 ? "Grupo cheio (4/4)" : "Adicionar time ao grupo..."}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          {availableTeams.map((team) => (
                            <SelectItem key={team.id} value={team.id} className="text-white hover:bg-zinc-700">
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Team List */}
                  <div className="p-4 space-y-2">
                    {group.teams.length === 0 ? (
                      <p className="text-zinc-500 text-sm text-center py-8">
                        Nenhum time neste grupo ainda.
                        <br />
                        <span className="text-xs">Adicione 4 times para fechar o grupo.</span>
                      </p>
                    ) : (
                      [...group.teams]
                        .sort((a, b) => b.cashout - a.cashout)
                        .map((gt, index) => {
                          const team = getTeam(gt.teamId)
                          if (!team) return null

                          return (
                            <div key={gt.teamId} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800">
                              <span
                                className={cn(
                                  "w-7 h-7 flex items-center justify-center rounded text-white text-sm font-bold",
                                  getPositionColor(index + 1),
                                )}
                              >
                                {index + 1}
                              </span>

                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                                {team.logo ? (
                                  <Image
                                    src={team.logo || "/placeholder.svg"}
                                    alt={team.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-zinc-400">
                                    {team.name.charAt(0)}
                                  </div>
                                )}
                              </div>

                              <span className="flex-1 font-medium text-white truncate">{team.name}</span>

                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                <Input
                                  type="number"
                                  value={gt.cashout}
                                  onChange={(e) => handleCashoutChange(group.id, gt.teamId, e.target.value)}
                                  className="w-24 h-9 text-center bg-zinc-700 border-zinc-600 text-white font-mono"
                                  disabled={group.locked}
                                  min={0}
                                  placeholder="0"
                                />
                              </div>

                              {!group.locked && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTeamFromGroup(group.id, gt.teamId)}
                                  className="text-zinc-400 hover:text-red-500 h-9 w-9"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )
                        })
                    )}

                    {group.teams.length > 0 && group.teams.length < 4 && !group.locked && (
                      <p className="text-amber-500 text-xs text-center pt-2">
                        Faltam {4 - group.teams.length} time(s) para fechar o grupo
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {dayGroups.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <p>Nenhum grupo Cashout disponível para este dia.</p>
        </div>
      )}
    </div>
  )
}
