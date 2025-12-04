import {
  type TournamentState,
  type Team,
  type Group,
  type Bo3Match,
  type BracketBo3,
  type FinalMatch,
  initialGroups,
} from "./types"

const STORAGE_KEY = "tournament_state_v3"

const getDefaultGroups = () => initialGroups.map((g) => ({ ...g, teams: [] }))

export function getInitialState(): TournamentState {
  const defaultState: TournamentState = {
    teams: [],
    groups: getDefaultGroups(),
    bo3Matches: [],
    bracketMatches: [],
    finalMatch: null,
    currentDay: 1,
  }

  if (typeof window === "undefined") {
    return defaultState
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return {
        teams: Array.isArray(parsed.teams) ? parsed.teams : [],
        groups: Array.isArray(parsed.groups) && parsed.groups.length > 0 ? parsed.groups : getDefaultGroups(),
        bo3Matches: Array.isArray(parsed.bo3Matches) ? parsed.bo3Matches : [],
        bracketMatches: Array.isArray(parsed.bracketMatches) ? parsed.bracketMatches : [],
        finalMatch: parsed.finalMatch || null,
        currentDay: parsed.currentDay || 1,
      }
    } catch {
      return defaultState
    }
  }

  return defaultState
}

export function saveState(state: TournamentState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

export function addTeam(state: TournamentState, team: Omit<Team, "id" | "createdAt">): TournamentState {
  const newTeam: Team = {
    ...team,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  const newState = {
    ...state,
    teams: [...state.teams, newTeam],
  }
  saveState(newState)
  return newState
}

export function updateTeam(state: TournamentState, teamId: string, updates: Partial<Team>): TournamentState {
  const newState = {
    ...state,
    teams: state.teams.map((t) => (t.id === teamId ? { ...t, ...updates } : t)),
  }
  saveState(newState)
  return newState
}

export function deleteTeam(state: TournamentState, teamId: string): TournamentState {
  const newState = {
    ...state,
    teams: state.teams.filter((t) => t.id !== teamId),
    groups: state.groups.map((g) => ({
      ...g,
      teams: g.teams.filter((gt) => gt.teamId !== teamId),
    })),
  }
  saveState(newState)
  return newState
}

export function updateGroup(state: TournamentState, groupId: string, updates: Partial<Group>): TournamentState {
  const newState = {
    ...state,
    groups: state.groups.map((g) => (g.id === groupId ? { ...g, ...updates } : g)),
  }
  saveState(newState)
  return newState
}

export function addTeamToGroup(state: TournamentState, groupId: string, teamId: string, cashout = 0): TournamentState {
  const group = state.groups.find((g) => g.id === groupId)
  if (!group) return state

  if (group.teams.some((t) => t.teamId === teamId)) return state

  const groupsWithoutTeam = state.groups.map((g) => ({
    ...g,
    teams: g.teams.filter((gt) => gt.teamId !== teamId),
  }))

  const targetGroup = groupsWithoutTeam.find((g) => g.id === groupId)!
  const newGroupTeam = {
    teamId,
    position: targetGroup.teams.length + 1,
    cashout,
    status: "playing" as const,
  }

  const newState = {
    ...state,
    groups: groupsWithoutTeam.map((g) => (g.id === groupId ? { ...g, teams: [...g.teams, newGroupTeam] } : g)),
  }
  saveState(newState)
  return newState
}

export function removeTeamFromGroup(state: TournamentState, groupId: string, teamId: string): TournamentState {
  const newState = {
    ...state,
    groups: state.groups.map((g) =>
      g.id === groupId ? { ...g, teams: g.teams.filter((gt) => gt.teamId !== teamId) } : g,
    ),
  }
  saveState(newState)
  return newState
}

export function updateTeamCashout(
  state: TournamentState,
  groupId: string,
  teamId: string,
  cashout: number,
): TournamentState {
  const newState = {
    ...state,
    groups: state.groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            teams: g.teams.map((gt) => (gt.teamId === teamId ? { ...gt, cashout } : gt)),
          }
        : g,
    ),
  }
  saveState(newState)
  return newState
}

export function lockGroupAndCreateBo3(state: TournamentState, groupId: string): TournamentState {
  const group = state.groups.find((g) => g.id === groupId)
  if (!group || group.teams.length < 4) return state

  const sortedTeams = [...group.teams].sort((a, b) => b.cashout - a.cashout)

  const updatedTeams = sortedTeams.map((t, index) => ({
    ...t,
    position: index + 1,
    status: index < 2 ? ("advanced" as const) : index < 4 ? ("lastChance" as const) : ("eliminated" as const),
  }))

  const upperMatch: Bo3Match = {
    id: `${groupId}-upper`,
    sourceGroupId: groupId,
    matchType: "upper",
    team1Id: updatedTeams[0]?.teamId || null,
    team2Id: updatedTeams[1]?.teamId || null,
    team1Wins: 0,
    team2Wins: 0,
    winnerId: null,
    loserId: null,
    completed: false,
    round: 1,
  }

  const lowerMatch: Bo3Match = {
    id: `${groupId}-lower`,
    sourceGroupId: groupId,
    matchType: "lower",
    team1Id: updatedTeams[2]?.teamId || null,
    team2Id: updatedTeams[3]?.teamId || null,
    team1Wins: 0,
    team2Wins: 0,
    winnerId: null,
    loserId: null,
    completed: false,
    round: 1,
  }

  const filteredMatches = state.bo3Matches.filter((m) => m.sourceGroupId !== groupId)

  const newState = {
    ...state,
    groups: state.groups.map((g) => (g.id === groupId ? { ...g, teams: updatedTeams, locked: true } : g)),
    bo3Matches: [...filteredMatches, upperMatch, lowerMatch],
  }
  saveState(newState)
  return newState
}

export function updateBo3Match(state: TournamentState, matchId: string, updates: Partial<Bo3Match>): TournamentState {
  const match = state.bo3Matches.find((m) => m.id === matchId)
  if (!match) return state

  const updatedMatch = { ...match, ...updates }

  // Check if match is now complete (someone has 2 wins)
  if (updatedMatch.team1Wins >= 2 || updatedMatch.team2Wins >= 2) {
    updatedMatch.completed = true
    updatedMatch.winnerId = updatedMatch.team1Wins >= 2 ? updatedMatch.team1Id : updatedMatch.team2Id
    updatedMatch.loserId = updatedMatch.team1Wins >= 2 ? updatedMatch.team2Id : updatedMatch.team1Id
  }

  let newState = {
    ...state,
    bo3Matches: state.bo3Matches.map((m) => (m.id === matchId ? updatedMatch : m)),
  }

  if (updatedMatch.completed && updatedMatch.winnerId && updatedMatch.loserId) {
    newState = handleBo3Completion(newState, updatedMatch)
  }

  saveState(newState)
  return newState
}

function handleBo3Completion(state: TournamentState, match: Bo3Match): TournamentState {
  const sourceGroupId = match.sourceGroupId
  const winnerId = match.winnerId!
  const loserId = match.loserId!

  // Define destination mappings based on group and match type
  // G1-G4 Upper (1st vs 2nd): Winner → G9/G10, Loser → G11
  // G1-G4 Lower (3rd vs 4th): Winner → G5/G6, Loser → Eliminated

  const upperDestinations: Record<string, { winner: string; loser: string }> = {
    g1: { winner: "g9", loser: "g11" },
    g2: { winner: "g9", loser: "g11" },
    g3: { winner: "g10", loser: "g11" },
    g4: { winner: "g10", loser: "g11" },
  }

  const lowerDestinations: Record<string, { winner: string; loser: null }> = {
    g1: { winner: "g5", loser: null },
    g2: { winner: "g5", loser: null },
    g3: { winner: "g6", loser: null },
    g4: { winner: "g6", loser: null },
  }

  let newGroups = [...state.groups]

  if (match.matchType === "upper" && upperDestinations[sourceGroupId]) {
    const dest = upperDestinations[sourceGroupId]

    // Add winner to destination group
    newGroups = newGroups.map((g) => {
      if (g.id === dest.winner) {
        const exists = g.teams.some((t) => t.teamId === winnerId)
        if (!exists) {
          return {
            ...g,
            teams: [
              ...g.teams,
              { teamId: winnerId, position: g.teams.length + 1, cashout: 0, status: "advanced" as const },
            ],
          }
        }
      }
      if (g.id === dest.loser) {
        const exists = g.teams.some((t) => t.teamId === loserId)
        if (!exists) {
          return {
            ...g,
            teams: [
              ...g.teams,
              { teamId: loserId, position: g.teams.length + 1, cashout: 0, status: "lastChance" as const },
            ],
          }
        }
      }
      return g
    })
  }

  if (match.matchType === "lower" && lowerDestinations[sourceGroupId]) {
    const dest = lowerDestinations[sourceGroupId]

    // Add winner to elimination group
    newGroups = newGroups.map((g) => {
      if (g.id === dest.winner) {
        const exists = g.teams.some((t) => t.teamId === winnerId)
        if (!exists) {
          return {
            ...g,
            teams: [
              ...g.teams,
              { teamId: winnerId, position: g.teams.length + 1, cashout: 0, status: "lastChance" as const },
            ],
          }
        }
      }
      return g
    })

    // Mark loser as eliminated in source group
    newGroups = newGroups.map((g) => {
      if (g.id === sourceGroupId) {
        return {
          ...g,
          teams: g.teams.map((t) => (t.teamId === loserId ? { ...t, status: "eliminated" as const } : t)),
        }
      }
      return g
    })
  }

  return { ...state, groups: newGroups }
}

export function updateBracketMatch(
  state: TournamentState,
  matchId: string,
  updates: Partial<BracketBo3>,
): TournamentState {
  const match = state.bracketMatches.find((m) => m.id === matchId)
  if (!match) return state

  const updatedMatch = { ...match, ...updates }

  if (updatedMatch.team1Wins >= 2 || updatedMatch.team2Wins >= 2) {
    updatedMatch.completed = true
    updatedMatch.winnerId = updatedMatch.team1Wins >= 2 ? updatedMatch.team1Id : updatedMatch.team2Id
    updatedMatch.loserId = updatedMatch.team1Wins >= 2 ? updatedMatch.team2Id : updatedMatch.team1Id
  }

  const newState = {
    ...state,
    bracketMatches: state.bracketMatches.map((m) => (m.id === matchId ? updatedMatch : m)),
  }
  saveState(newState)
  return newState
}

export function addBracketMatch(state: TournamentState, match: Omit<BracketBo3, "id">): TournamentState {
  const newMatch: BracketBo3 = {
    ...match,
    id: crypto.randomUUID(),
  }
  const newState = {
    ...state,
    bracketMatches: [...state.bracketMatches, newMatch],
  }
  saveState(newState)
  return newState
}

export function initFinalMatch(state: TournamentState, teamIds: string[]): TournamentState {
  const finalMatch: FinalMatch = {
    id: crypto.randomUUID(),
    teams: teamIds.map((teamId) => ({ teamId, points: 0 })),
    winnerId: null,
    completed: false,
  }
  const newState = {
    ...state,
    finalMatch,
  }
  saveState(newState)
  return newState
}

export function updateFinalPoints(state: TournamentState, teamId: string, points: number): TournamentState {
  if (!state.finalMatch) return state

  const teams = state.finalMatch.teams.map((t) => (t.teamId === teamId ? { ...t, points } : t))
  const winner = teams.find((t) => t.points >= 5)

  const newState = {
    ...state,
    finalMatch: {
      ...state.finalMatch,
      teams,
      winnerId: winner?.teamId || null,
      completed: !!winner,
    },
  }
  saveState(newState)
  return newState
}

export function clearStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
