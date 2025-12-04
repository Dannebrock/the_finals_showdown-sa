"use client"

import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { cn } from "@/lib/utils"

interface TeamSlotProps {
  teamId: string | null
  position?: number
  status?: "playing" | "advanced" | "lastChance" | "eliminated"
  cashout?: number
  showCashout?: boolean
  size?: "sm" | "md" | "lg"
  transparentBg?: boolean
}

export function TeamSlot({
  teamId,
  position,
  status = "playing",
  cashout,
  showCashout = false,
  size = "md",
  transparentBg = false 
}: TeamSlotProps) {
  const { getTeamById } = useTournament()
  const team = teamId ? getTeamById(teamId) : null

  // AQUI DEFINEM AS CORES FINAIS NA TELA:
  const statusColors = {
    playing: "bg-zinc-800",      // Neutro/Jogando
    advanced: "bg-zinc-800",    // 1º e 2º (Winners) -> Fica VERDE
    lastChance: "bg-zinc-800", // 3º e 4º (Repescagem) -> Fica LARANJA
    eliminated: "bg-red-600",    // Eliminado -> Fica VERMELHO
  }

  const bgColor = transparentBg ? "bg-transparent" : statusColors[status]

  const sizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "px-2 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  }

  // Ajusta cor do texto para contraste
  const textColor = transparentBg ? "text-inherit" : "text-white"

  if (!team) {
    return (
      <div className={cn(sizeClasses[size], "text-zinc-500 font-medium px-2")}>
        TBD
      </div>
    )
  }

  return (
    <div
      className={cn(sizeClasses[size], "flex items-center gap-2 font-bold h-10 p-2", textColor, bgColor)}
    >
      {/* Logo */}
      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-black/20 flex-shrink-0">
        {team.logo ? (
          <Image
            src={team.logo || "/placeholder.svg"}
            alt={team.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
            {team.name.charAt(0)}
          </div>
        )}
      </div>
      
      {/* Nome */}
      <span className="truncate leading-none pt-0.5">{team.name}</span>
      
      {/* Valor do Cashout (se ativado) */}
      {showCashout && cashout !== undefined && (
        <span className="ml-auto text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-white">
          ${cashout}
        </span>
      )}
    </div>
  )
}