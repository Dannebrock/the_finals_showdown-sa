"use client"

import { useTournament } from "@/components/tournament-context"
import { GroupWithBo3 } from "./group-with-bo3"
import { TeamSlot } from "./team-slot"
import { Trophy } from "lucide-react"

export function Day2Bracket() {
  const { state } = useTournament()

  const top8Groups = state.groups.filter((g) => g.day === 2 && g.phase === "TOP 8")
  const quarterFinalGroup = state.groups.find((g) => g.id === "g11")
  const semiFinalGroup = state.groups.find((g) => g.id === "g12")
  const finalGroup = state.groups.find((g) => g.id === "g13")

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

      {/* ELIMINATION QUARTER-FINAL */}
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

      {/* ELIMINATION SEMI-FINAL */}
      {semiFinalGroup && (
        <section>
          <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 border-l-4 border-red-600 pl-3 md:pl-4">
            ELIMINATION SEMI-FINAL
          </h2>
          <div className="overflow-x-auto pb-2">
            <GroupWithBo3 group={semiFinalGroup} />
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
        <div className="bg-zinc-900 rounded-lg border-2 border-dashed border-amber-500/50 p-4 md:p-6">
          <div className="text-center text-base md:text-lg font-bold text-amber-400 mb-3 md:mb-4">G13</div>
          {state.finalMatch?.teams && state.finalMatch.teams.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {state.finalMatch.teams.map((ft) => (
                <div key={ft.teamId} className="text-center">
                  <TeamSlot
                    teamId={ft.teamId}
                    status={state.finalMatch?.winnerId === ft.teamId ? "advanced" : "playing"}
                    size="sm"
                  />
                  <div className="mt-1.5 md:mt-2 text-xl md:text-2xl font-black text-white">{ft.points} pts</div>
                  {state.finalMatch?.winnerId === ft.teamId && (
                    <div className="mt-1 text-amber-400 font-bold flex items-center justify-center gap-1 text-xs md:text-sm">
                      <Trophy className="w-3 h-3 md:w-4 md:h-4" /> CAMPEÃO
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-zinc-500 py-6 md:py-8 text-sm md:text-base">
              Aguardando times para a final...
            </div>
          )}
        </div>
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
