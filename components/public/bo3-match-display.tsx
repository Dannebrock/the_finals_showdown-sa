"use client"

import { TeamSlot } from "./team-slot"
import type { Bo3Match } from "@/lib/types"
import { cn } from "@/lib/utils"

// Definição local de cores (igual ao anterior)
const themeColors = {
  playing: "bg-zinc-800",
  sunday: "bg-amber-500",   
  survival: "bg-cyan-600",   
  eliminated: "bg-red-600",  
}

interface Bo3MatchDisplayProps {
  match: Bo3Match
  label?: string
}

export function Bo3MatchDisplay({ match, label = "best of 3" }: Bo3MatchDisplayProps) {
  
  const getStatusColorClass = (teamId: string | null) => {
    if (!match.completed) return themeColors.playing

    if (match.winnerId === teamId) {
      if (match.matchType === 'upper') return themeColors.sunday
      return themeColors.survival
    } else {
      if (match.matchType === 'upper') return themeColors.survival
      return themeColors.eliminated
    }
  }

  const containerBorder = match.completed ? "border-white/40" : "border-zinc-800"

  return (
    <div className="flex flex-col items-center relative z-10">
      {label && (
        <div className="text-[10px] sm:text-xs text-zinc-400 mb-1.5 sm:mb-2 font-medium bg-black/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10">
          {label}
        </div>
      )}
      
      <div className={cn(
        "bg-zinc-900 rounded-lg border overflow-hidden min-w-[140px] shadow-xl transition-all",
        containerBorder
      )}>
        <div className="p-1.5 sm:p-2 space-y-1">
          
          {/* === TIME 1 === */}
          <div className={cn("rounded flex items-center p-1 gap-2 transition-colors", getStatusColorClass(match.team1Id))}>
            <div className="flex-1">
              <TeamSlot 
                teamId={match.team1Id} 
                status="playing" 
                size="sm" 
                transparentBg={true} 
                
              />
            </div>
            
            {/* PLACAR NUMÉRICO - TIME 1 */}
            <div className="flex items-center justify-center w-8 h-8 rounded bg-black/20 font-mono text-lg font-bold text-white mr-1">
              {match.team1Wins}
            </div>
          </div>

          {/* === TIME 2 === */}
          <div className={cn("rounded flex items-center p-1 gap-2 transition-colors", getStatusColorClass(match.team2Id))}>
            <div className="flex-1">
              <TeamSlot 
                teamId={match.team2Id} 
                status="playing" 
                size="sm"
                transparentBg={true}
               
              />
            </div>
            
            {/* PLACAR NUMÉRICO - TIME 2 */}
            <div className="flex items-center justify-center w-8 h-8 rounded bg-black/20 font-mono text-lg font-bold text-white mr-1">
              {match.team2Wins}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}