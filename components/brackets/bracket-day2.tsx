"use client"

import { useTournament } from "@/components/tournament-context"
import { CashoutGroup } from "@/components/brackets/cashout-group"
import { Bo3Bracket } from "@/components/brackets/bo3-bracket"
import { FinalBracket } from "@/components/brackets/final-bracket"

export function BracketDay2() {
  const { state, getTeamById } = useTournament()
  const { groups, bo3Matches, finalMatch } = state

  if (!groups || !Array.isArray(groups)) {
    return <div className="text-center text-zinc-400 py-8">Carregando grupos...</div>
  }

  // Get Day 2 groups
  const top8 = groups.filter((g) => g.day === 2 && g.phase === "TOP 8")
  const eliminationQF = groups.filter((g) => g.day === 2 && g.phase === "ELIMINATION QUARTER-FINAL")
  const eliminationSF = groups.filter((g) => g.day === 2 && g.phase === "ELIMINATION SEMI-FINAL")
  const theFinal = groups.filter((g) => g.day === 2 && g.phase === "THE FINAL")

  // Get Bo3 matches for Day 2
  const day2Bo3 = (bo3Matches || []).filter((m) => m.day === 2)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Top 8 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Top 8</h3>
          <div className="space-y-6">
            {top8.map((group) => (
              <CashoutGroup key={group.id} group={group} getTeamById={getTeamById} />
            ))}
          </div>
        </div>

        {/* Elimination Quarter-Final */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Eliminação</h3>
          <p className="text-sm text-zinc-400">Quarter-Final</p>
          <div className="space-y-6">
            {eliminationQF.map((group) => (
              <CashoutGroup key={group.id} group={group} getTeamById={getTeamById} />
            ))}
          </div>
          <p className="text-sm text-zinc-400 mt-4">Semi-Final</p>
          <div className="space-y-6">
            {eliminationSF.map((group) =>
              group.type === "bo3" ? (
                <Bo3Bracket
                  key={group.id}
                  title={group.name}
                  matches={day2Bo3.filter((m) => m.sourceGroup === group.id)}
                  getTeamById={getTeamById}
                />
              ) : (
                <CashoutGroup key={group.id} group={group} getTeamById={getTeamById} />
              ),
            )}
          </div>
        </div>

        {/* Winners Final */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Winners Final</h3>
          <Bo3Bracket
            title="Bo3"
            matches={day2Bo3.filter((m) => m.phase === "WINNERS FINAL")}
            getTeamById={getTeamById}
          />
        </div>

        {/* The Final */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-400 uppercase tracking-wide">The Final</h3>
          <p className="text-sm text-zinc-400">Primeiro a atingir 5 pontos vence</p>
          {theFinal.map((group) => (
            <FinalBracket key={group.id} group={group} finalMatch={finalMatch} getTeamById={getTeamById} />
          ))}
        </div>
      </div>
    </div>
  )
}
