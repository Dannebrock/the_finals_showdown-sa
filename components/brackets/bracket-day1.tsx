"use client"

import { useTournament } from "@/components/tournament-context"
import { CashoutGroup } from "@/components/brackets/cashout-group"
import { Bo3Bracket } from "@/components/brackets/bo3-bracket"

export function BracketDay1() {
  const { state, getTeamById } = useTournament()
  const { groups, bo3Matches } = state

  if (!groups || !Array.isArray(groups)) {
    return <div className="text-center text-zinc-400 py-8">Carregando grupos...</div>
  }

  // Get Day 1 groups
  const winnersTop16 = groups.filter((g) => g.day === 1 && g.phase === "WINNERS TOP 16")
  const eliminationRound = groups.filter((g) => g.day === 1 && g.phase === "ELIMINATION ROUND")
  const lastChance = groups.filter((g) => g.day === 1 && g.phase === "LAST CHANCE")

  // Get Bo3 matches for Day 1
  const day1Bo3 = (bo3Matches || []).filter((m) => m.day === 1)

  return (
    <div className="space-y-8">
      {/* Winners Top 16 Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* G1-G4 Cashout Groups */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Winners Top 16</h3>
          <div className="space-y-6">
            {winnersTop16.map((group) => (
              <CashoutGroup key={group.id} group={group} getTeamById={getTeamById} />
            ))}
          </div>
        </div>

        {/* Elimination Round */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Elimination Round</h3>
          <div className="space-y-6">
            {eliminationRound.map((group) => (
              <CashoutGroup key={group.id} group={group} getTeamById={getTeamById} />
            ))}
          </div>
        </div>

        {/* Last Chance */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Last Chance</h3>
          <div className="space-y-6">
            {lastChance.map((group) =>
              group.type === "cashout" ? (
                <CashoutGroup key={group.id} group={group} getTeamById={getTeamById} />
              ) : (
                <Bo3Bracket
                  key={group.id}
                  title={group.name}
                  matches={day1Bo3.filter((m) => m.sourceGroup === group.id)}
                  getTeamById={getTeamById}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
