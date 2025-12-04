"use client"

import { useTournament } from "@/components/tournament-context"
import { GroupWithBo3 } from "./group-with-bo3"
import { Bo3OnlyGroup } from "./bo3-only-group"

export function Day1Bracket() {
  const { state } = useTournament()

  const winnersGroups = state.groups.filter((g) => g.day === 1 && g.phase === "WINNERS TOP 16")
  const eliminationGroups = state.groups.filter((g) => g.day === 1 && g.phase === "ELIMINATION ROUND")
  const g7 = state.groups.find((g) => g.id === "g7")
  const g8 = state.groups.find((g) => g.id === "g8")

  return (
    <div className="space-y-8 md:space-y-12">
      {/* WINNERS TOP 16 */}
      <section>
        <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 border-l-4 border-red-600 pl-3 md:pl-4">
          WINNERS TOP 16
        </h2>
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {winnersGroups.map((group) => (
            <div key={group.id} className="overflow-x-auto pb-2">
              <GroupWithBo3 group={group} />
            </div>
          ))}
        </div>
      </section>

      {/* ELIMINATION ROUND */}
      {eliminationGroups.length > 0 && eliminationGroups.some((g) => g.teams.length > 0) && (
        <section>
          <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 border-l-4 border-red-600 pl-3 md:pl-4">
            ELIMINATION ROUND
          </h2>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {eliminationGroups.map((group) => (
              <div key={group.id} className="overflow-x-auto pb-2">
                <GroupWithBo3 group={group} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LAST CHANCE - G7 (Cashout) + G8 (Bo3) */}
      {(g7 || g8) && (
        <section>
          <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 border-l-4 border-red-600 pl-3 md:pl-4">
            LAST CHANCE
          </h2>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {/* G7 com seus Bo3 */}
            {g7 && (
              <div className="overflow-x-auto pb-2">
                <GroupWithBo3 group={g7} />
              </div>
            )}
            {/* G8 é um Bo3 direto */}
            {g8 && (
              <div className="overflow-x-auto pb-2">
                <Bo3OnlyGroup group={g8} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Date info */}
      <div className="text-right text-zinc-400 font-medium space-y-1 text-xs md:text-sm">
        <p>BR | Sábado, 6 de dezembro, das 14h às 21h.</p>
        <p>ES | Sábado, 6 de diciembre, de 14h a 21h.</p>
        <p>EN | Saturday, December 6, from 2PM to 9PM.</p>
      </div>
    </div>
  )
}
