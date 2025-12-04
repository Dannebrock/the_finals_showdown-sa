"use client"

import { useTournament } from "@/components/tournament-context"
import { PublicHeader } from "@/components/public/public-header"
import { DayTabs } from "@/components/public/day-tabs"
import { Day1Bracket } from "@/components/public/day1-bracket"
import { Day2Bracket } from "@/components/public/day2-bracket"
import { Legend } from "@/components/public/legend"

export default function HomePage() {
  const { state, setCurrentDay } = useTournament()
  const { currentDay } = state

  return (
    <div className="min-h-screen bg-zinc-950">
      <PublicHeader />

      <div className="container mx-auto px-4 py-6">
        <DayTabs currentDay={currentDay} onDayChange={setCurrentDay} />

        <div className="mt-8">{currentDay === 1 ? <Day1Bracket /> : <Day2Bracket />}</div>

        <Legend />
      </div>
    </div>
  )
}
