"use client"

import { TeamSlot } from "./team-slot"
import type { Bo3Match } from "@/lib/types"
import { cn } from "@/lib/utils"

const themeColors = {
  playing: "bg-zinc-800",
  
  // Cores do Dia 1 (Qualificatórias)
  sunday: "bg-amber-500",      // Classificado para Domingo
  survival: "bg-cyan-600",     // Sobreviveu/Repescagem (Teal/Cyan)
  eliminated: "bg-red-600",    // Eliminado
  
  // Cores do Dia 2 (Finais)
  finalGreen: "bg-green-600",  // Classificado para a Grande Final (G13)
  droppingTeal: "bg-cyan-600", // Sobreviveu no Dia 2
}

interface Bo3MatchDisplayProps {
  match: Bo3Match
  label?: string
}

export function Bo3MatchDisplay({ match, label = "best of 3" }: Bo3MatchDisplayProps) {
  
  const getStatusColorClass = (teamId: string | null) => {
    // 1. Partida em andamento
    if (!match.completed) return themeColors.playing

    const isWinner = match.winnerId === teamId
    const groupId = match.sourceGroupId?.toLowerCase() || ""

    // --- CORREÇÃO G8 (Last Chance - Dia 1) ---
    // Vencedor vai pro Domingo (Amarelo), Perdedor eliminado (Vermelho)
    if (groupId === 'g8') {
       if (isWinner) return themeColors.sunday
       return themeColors.eliminated
    }

    // --- LÓGICA DO DIA 2 (G9, G10, G11, G12) ---
    if (['g9', 'g10', 'g11', 'g12'].includes(groupId)) {
      
      // Caso G12 (Semi-Final): Só tem uma partida. Vencedor -> Final (Verde). Perdedor -> Casa (Vermelho).
      if (groupId === 'g12') {
         if (isWinner) return themeColors.finalGreen
         return themeColors.eliminated
      }

      // Para G9, G10, G11 (Que têm Upper e Lower)
      if (match.matchType === 'upper') {
         // Upper (1º vs 2º): Vencedor vai pra Final (Verde), Perdedor cai pra repescagem (Teal)
         if (isWinner) return themeColors.finalGreen 
         return themeColors.droppingTeal 
      } else {
         // Lower (3º vs 4º): Vencedor avança na repescagem (Teal), Perdedor é eliminado (Vermelho)
         if (isWinner) return themeColors.droppingTeal 
         return themeColors.eliminated 
      }
    }

    // --- LÓGICA PADRÃO (DIA 1 - G1 a G7) ---
    if (isWinner) {
      // Vencedor da Upper vai pro Domingo (Amarelo)
      if (match.matchType === 'upper') return themeColors.sunday
      // Vencedor da Lower sobrevive (Cyan)
      return themeColors.survival
    } else {
      // Perdedor da Upper cai pra Lower (Cyan)
      if (match.matchType === 'upper') return themeColors.survival
      // Perdedor da Lower é eliminado (Vermelho)
      return themeColors.eliminated
    }
  }

  const containerBorder = match.completed ? "border-white/40" : "border-zinc-800"

  return (
    <div className="flex flex-col items-center relative z-10">
      {label && (
        <div className="text-[10px] sm:text-xs text-zinc-400 mb-1.5 sm:mb-2 font-medium bg-black/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 uppercase tracking-wider">
          {label}
        </div>
      )}
      
      <div className={cn(
        "bg-zinc-900 rounded-lg border overflow-hidden min-w-[140px] shadow-xl transition-all",
        containerBorder
      )}>
        <div className="p-1.5 sm:p-2 space-y-1">
          
          {/* === TIME 1 === */}
          <div className={cn("rounded flex items-center p-1 gap-2 transition-colors duration-300", getStatusColorClass(match.team1Id))}>
            <div className="flex-1 min-w-0">
              <TeamSlot 
                teamId={match.team1Id} 
                status="playing" 
                size="sm" 
                transparentBg={true} 
              />
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded bg-black/20 font-mono text-lg font-bold text-white shadow-inner mr-1">
              {match.team1Wins}
            </div>
          </div>

          {/* === TIME 2 === */}
          <div className={cn("rounded flex items-center p-1 gap-2 transition-colors duration-300", getStatusColorClass(match.team2Id))}>
            <div className="flex-1 min-w-0">
              <TeamSlot 
                teamId={match.team2Id} 
                status="playing" 
                size="sm"
                transparentBg={true}
              />
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded bg-black/20 font-mono text-lg font-bold text-white shadow-inner mr-1">
              {match.team2Wins}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}