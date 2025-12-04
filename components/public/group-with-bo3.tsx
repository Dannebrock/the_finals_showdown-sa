"use client"

import { useTournament } from "@/components/tournament-context"
import { CashoutGroupDisplay } from "./cashout-group-display"
import { Bo3MatchDisplay } from "./bo3-match-display"
import type { Group } from "@/lib/types"

interface GroupWithBo3Props {
  group: Group
}

export function GroupWithBo3({ group }: GroupWithBo3Props) {
  const { state } = useTournament()

  const upperMatch = state.bo3Matches.find((m) => m.sourceGroupId === group.id && m.matchType === "upper")
  const lowerMatch = state.bo3Matches.find((m) => m.sourceGroupId === group.id && m.matchType === "lower")

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-3">
      <CashoutGroupDisplay group={group} />

      {group.locked && (upperMatch || lowerMatch) && (
        <>
          {/* Connecting line - hidden on mobile */}
          <div className="hidden sm:flex flex-col justify-center h-full w-full py-8">
            <div className="w-full border-t-2 border-gray-50" />
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-full">
            {upperMatch && <Bo3MatchDisplay match={upperMatch} label="Best of 3 - 1º vs 2º" />}
            {lowerMatch && <Bo3MatchDisplay match={lowerMatch} label="Best of 3 - 3º vs 4º" />}
          </div>
        </>
      )}
    </div>
  )
}
