"use client"

import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { GroupWithBo3 } from "./group-with-bo3"
import { Bo3OnlyGroup } from "./bo3-only-group" // <--- 1. IMPORTADO AQUI
import { TeamSlot } from "./team-slot"
import { Trophy, Loader2, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

// Cores do tema (Final)
const themeColors = {
  final: "bg-green-600 border-green-500 shadow-[0_0_20px_rgba(22,163,74,0.6)] ring-2 ring-green-400",
  default: "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 transition-colors"
}

export function Day2Bracket() {
  const { state, loading, getTeamById } = useTournament()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-zinc-400 font-medium animate-pulse">Carregando chaves...</p>
      </div>
    )
  }

  const top8Groups = state.groups.filter((g) => g.day === 2 && g.phase === "TOP 8")
  const quarterFinalGroup = state.groups.find((g) => g.id === "G11" || g.id === "g11")
  const semiFinalGroup = state.groups.find((g) => g.id === "G12" || g.id === "g12")
  const finalGroupRaw = state.groups.find((g) => g.id === "G13" || g.id === "g13")

  const hasFinalStarted = state.finalMatch?.teams && state.finalMatch.teams.length > 0
  const winnerId = state.finalMatch?.winnerId
  const winnerTeam = winnerId ? getTeamById(winnerId) : null

  const finalTeamsToDisplay = hasFinalStarted
    ? state.finalMatch!.teams
    : (finalGroupRaw?.teams || []).map(t => ({ teamId: t.teamId, points: 0 }))

  return (
    <div className="space-y-8 md:space-y-12">
      {/* TOP 8 */}
      <section>
        <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 border-l-4 border-red-600 pl-3 md:pl-4">
          TOP 8
        </h2>
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {top8Groups.map((group) => (
            <div key={group.id} className="overflow-x-auto pb-2">
              <GroupWithBo3 group={group} />
            </div>
          ))}
        </div>
      </section>

      {/* ELIMINATION QUARTER-FINAL (G11) */}
      {quarterFinalGroup && (
        <section>
          <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 border-l-4 border-red-600 pl-3 md:pl-4">
            ELIMINATION QUARTER-FINAL
          </h2>
          <div className="overflow-x-auto pb-2">
            <GroupWithBo3 group={quarterFinalGroup} />
          </div>
        </section>
      )}

      {/* ELIMINATION SEMI-FINAL (G12) - ALTERADO AQUI */}
      {semiFinalGroup && (
        <section>
          <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 border-l-4 border-red-600 pl-3 md:pl-4">
            ELIMINATION SEMI-FINAL
          </h2>
          <div className="overflow-x-auto pb-2">
            {/* 2. ALTERADO DE GroupWithBo3 PARA Bo3OnlyGroup */}
            <Bo3OnlyGroup group={semiFinalGroup} />
          </div>
        </section>
      )}

      {/* THE FINAL */}
      <section>
        <h2 className="text-lg md:text-2xl font-black text-amber-400 mb-4 md:mb-6 border-l-4 border-amber-400 pl-3 md:pl-4 flex items-center gap-2 md:gap-3">
          <Trophy className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden sm:inline">THE FINAL - FIRST TO REACH 5 POINTS WINS</span>
          <span className="sm:hidden">FINAL - 5 PTS</span>
        </h2>
        
        <div className="bg-zinc-900 rounded-lg border-2 border-dashed border-amber-500/50 p-4 md:p-6 mb-8">
          <div className="text-center text-base md:text-lg font-bold text-amber-400 mb-3 md:mb-4">G13</div>
          
          {finalTeamsToDisplay.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {finalTeamsToDisplay.map((ft) => {
                const isWinner = hasFinalStarted && state.finalMatch?.winnerId === ft.teamId
                
                return (
                  <div key={ft.teamId} className="flex flex-col gap-2">
                    <div 
                      className={cn(
                        "rounded-lg p-1.5 border-2 transition-all duration-500",
                        isWinner ? themeColors.final : themeColors.default
                      )}
                    >
                      <TeamSlot
                        teamId={ft.teamId}
                        status={isWinner ? "advanced" : "playing"}
                        size="sm"
                      />
                    </div>

                    <div className="text-center">
                      <div className={cn(
                        "text-2xl md:text-3xl font-black",
                        isWinner ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "text-white"
                      )}>
                        {ft.points} pts
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-zinc-500 py-6 md:py-8 text-sm md:text-base">
              Aguardando times para a final...
            </div>
          )}
        </div>

        {/* ---  DESTAQUE DO CAMPEÃO --- */}
        {winnerTeam && (
           <div className="relative mt-12 mb-8 animate-in zoom-in fade-in duration-1000 slide-in-from-bottom-10">
              {/* Brilho de fundo */}
              <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative bg-gradient-to-b from-zinc-900 to-black border border-amber-500/50 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-amber-500 rounded-full p-3 shadow-lg">
                    <Crown className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse" />
                 </div>

                 <h3 className="text-zinc-400 font-medium tracking-[0.2em] uppercase text-sm md:text-base mb-6 mt-2">
                    Grand Champion
                 </h3>
                 
                 <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-6">
                    {winnerTeam.logo ? (
                       <Image 
                          src={winnerTeam.logo} 
                          alt={winnerTeam.name} 
                          fill 
                          className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                       />
                    ) : (
                       <div className="w-full h-full bg-zinc-800 rounded-full flex items-center justify-center text-4xl font-bold text-zinc-600">
                          {winnerTeam.name.charAt(0)}
                       </div>
                    )}
                 </div>

                 <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                    {winnerTeam.name}
                 </h2>
                 
                 <div className="mt-4 flex items-center justify-center gap-2 text-amber-500/80 text-sm font-medium">
                    <div className="flex h-16 w-28 sm:h-12 sm:w-42 items-center justify-center rounded-lg mt-1">            
                      <img src="../logo_tf_white.png" alt="" />
                    </div>                  
                 </div>
              </div>
           </div>
        )}

      </section>

      {/* Date info */}
      <div className="text-right text-zinc-400 font-medium space-y-1 text-xs md:text-sm">
        <p>BR | Domingo, 7 de dezembro, das 14h às 21h.</p>
        <p>ES | Domingo, 7 de diciembre, de 14h a 21h.</p>
        <p>EN | Sunday, December 7, from 2PM to 9PM.</p>
      </div>
    </div>
  )
}