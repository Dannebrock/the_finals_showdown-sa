"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, Trash2 } from "lucide-react"

export function TeamManagement() {
  const { state, addTeam, deleteTeam } = useTournament()
  const [teamName, setTeamName] = useState("")
  const [teamLogo, setTeamLogo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTeamLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTeam = () => {
    if (!teamName.trim()) return

    addTeam({
      name: teamName.trim(),
      logo: teamLogo,
    })

    setTeamName("")
    setTeamLogo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDeleteTeam = (teamId: string) => {
    if (confirm("Tem certeza que deseja excluir este time?")) {
      deleteTeam(teamId)
    }
  }

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gerenciar Times ({state.teams.length}/16)
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Add Team Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamName" className="text-zinc-300">
              Nome do Time
            </Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ex: Team Alpha"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamLogo" className="text-zinc-300">
              Logo do Time
            </Label>
            <Input
              ref={fileInputRef}
              id="teamLogo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-zinc-800 border-zinc-700 text-white cursor-pointer file:bg-zinc-700 file:text-white file:border-0"
            />
          </div>
        </div>

        <Button
          onClick={handleAddTeam}
          disabled={!teamName.trim() || state.teams.length >= 16}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Time
        </Button>

        {/* Team List */}
        {state.teams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
            {state.teams.map((team) => (
              <div key={team.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                  {team.logo ? (
                    <Image src={team.logo || "/placeholder.svg"} alt={team.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-zinc-400">
                      {team.name.charAt(0)}
                    </div>
                  )}
                </div>

                <span className="flex-1 font-medium text-white truncate">{team.name}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-zinc-400 hover:text-red-500 hover:bg-zinc-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
