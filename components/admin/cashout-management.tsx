"use client"

import { useState } from "react"
import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function CashoutManagement() {
  const { state, updateTeamCashout, updateTeamStatus } = useTournament()
  const { teams, groups } = state

  const [selectedGroup, setSelectedGroup] = useState<string>("")

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId)

  // Filter only cashout type groups
  const cashoutGroups = groups.filter((g) => g.type === "cashout")
  const currentGroup = cashoutGroups.find((g) => g.id === selectedGroup)

  const handleCashoutUpdate = (teamId: string, value: string) => {
    if (!selectedGroup) return
    const cashout = Number.parseInt(value) || 0
    updateTeamCashout(selectedGroup, teamId, cashout)
  }

  const handleClassify = () => {
    if (!currentGroup) return

    // Sort teams by cashout
    const sortedTeams = [...currentGroup.teams].sort((a, b) => b.cashout - a.cashout)

    // Update statuses based on position
    sortedTeams.forEach((team, index) => {
      let status: "playing" | "advanced" | "lastChance" | "eliminated"

      // LÓGICA REFATORADA: Ninguém é eliminado
      if (index <= 1) {
        status = "advanced" // 1º e 2º avançam (conforme aviso na tela)
      } else {
        status = "playing" // 3º e 4º continuam jogando (sem status 'eliminated')
      }

      updateTeamStatus(selectedGroup, team.teamId, status)
    })

    alert("Classificação atualizada! 1º e 2º avançam, os demais continuam na disputa.")
  }

  // Sort teams by cashout
  const sortedTeams = currentGroup ? [...currentGroup.teams].sort((a, b) => b.cashout - a.cashout) : []

  return (
    <div className="space-y-6">
      {/* Group Selection */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-500" />
          Sistema Cashout
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Insira o valor do dinheiro extraído. Os 1º e 2º colocados avançam, mas ninguém é eliminado nesta etapa.
        </p>

        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm text-zinc-400">Selecionar Grupo</label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Escolha um grupo Cashout..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {cashoutGroups
                  .filter((g) => g.teams.length >= 2)
                  .map((g) => (
                    <SelectItem key={g.id} value={g.id} className="text-white hover:bg-zinc-700">
                      {g.name} - {g.phase} ({g.teams.length} times)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cashout Input Table */}
      {currentGroup && (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="bg-zinc-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-white" />
              <span className="font-bold text-white">{currentGroup.name} - Cashout</span>
            </div>
            <span className="text-sm text-white/80">{currentGroup.phase}</span>
          </div>

          <div className="p-4 space-y-3">
            {sortedTeams.map((gt, index) => {
              const team = getTeam(gt.teamId)
              if (!team) return null

              const position = index + 1
              
              // REFATORADO: Cor neutra para todas as posições
              const bgColor = "bg-zinc-700"

              return (
                <div key={gt.teamId} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800">
                  {/* Position */}
                  <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white font-bold", bgColor)}>
                    {position}
                  </div>

                  {/* Team Logo */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                    {team.logo ? (
                      <Image src={team.logo || "/placeholder.svg"} alt={team.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-zinc-400">
                        {team.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Team Name */}
                  <span className="flex-1 font-medium text-white">{team.name}</span>

                  {/* Cashout Input */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <Input
                      type="number"
                      value={gt.cashout}
                      onChange={(e) => handleCashoutUpdate(gt.teamId, e.target.value)}
                      className="w-32 h-10 text-right text-lg font-mono bg-zinc-700 border-zinc-600 text-white"
                      min={0}
                      step={100}
                    />
                  </div>

                  {/* Status indicator */}
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      gt.status === "advanced" && "bg-green-500/20 text-green-400",
                      gt.status === "lastChance" && "bg-orange-500/20 text-orange-400",
                      gt.status === "eliminated" && "bg-red-500/20 text-red-400", // Mantido caso exista algum legado, mas não será usado pela nova lógica
                      gt.status === "playing" && "bg-sky-500/20 text-sky-400",
                    )}
                  >
                    {gt.status === "advanced" && "Avança"}
                    {gt.status === "lastChance" && "Última Chance"}
                    {gt.status === "eliminated" && "Eliminado"}
                    {gt.status === "playing" && "Jogando"}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Classification Button */}
          <div className="p-4 border-t border-zinc-800">
            <Button
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-6 text-lg"
              onClick={handleClassify}
              disabled={sortedTeams.length < 2}
            >
              <Check className="w-5 h-5 mr-2" />
              Atualizar Classificação
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-center text-zinc-500 text-sm mt-2">Classifica por valor, sem eliminar times.</p>
          </div>
        </div>
      )}
      
      {/* Legenda removida pois não há mais cores por posição */}
    </div>
  )
}