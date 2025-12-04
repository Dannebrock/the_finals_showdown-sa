"use client"

import type { Group, Team } from "@/lib/types"
import { GroupCard } from "./group-card"

interface BracketSectionProps {
  title: string
  groups: Group[]
  teams: Team[]
  subtitle?: string
}

export function BracketSection({ title, groups, teams, subtitle }: BracketSectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} teams={teams} />
        ))}
      </div>
    </div>
  )
}
