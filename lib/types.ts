// ... (mantenha as interfaces Team, Group, etc. iguais ao anterior) ...

export interface Team {
  id: string
  name: string
  logo: string | null
}

export interface GroupTeam {
  teamId: string
  position: number
  cashout: number
  status: "playing" | "advanced" | "lastChance" | "eliminated"
  name: string
  logo: string | null
}

export interface Group {
  id: string
  name: string
  phase: string
  day: number
  type: "cashout" | "bo3" | "final"
  locked: boolean
  teams: GroupTeam[]
}

export interface Bo3Match {
  id: string
  phase: string
  day: number
  team1Id: string | null
  team2Id: string | null
  team1Wins: number
  team2Wins: number
  winnerId: string | null
  completed: boolean
  sourceGroupId: string
  matchType: "upper" | "lower"
}

export interface FinalMatchTeam {
  teamId: string
  points: number
}

export interface FinalMatch {
  id: string
  winnerId: string | null
  completed: boolean
  teams: FinalMatchTeam[]
}

export interface TournamentState {
  teams: Team[]
  groups: Group[]
  bo3Matches: Bo3Match[]
  finalMatch: FinalMatch | null
  currentDay: number
}

// --- CORES DO TEMA (Baseado na Imagem Amarela) ---
export const themeColors = {
  final: "bg-green-500 border-green-600 text-black",   // Verde (Final)
  sunday: "bg-amber-500 border-amber-600 text-black",   // Laranja (Classificado Domingo)
  survival: "bg-cyan-500 border-cyan-600 text-black",  // Azul/Ciano (Repescagem)
  eliminated: "bg-red-600 border-red-700 text-white",  // Vermelho (Eliminado)
  playing: "bg-zinc-800 border-zinc-700 text-white",   // Neutro
  line: "border-white/20" // Cor das linhas de conexão
}

// Labels para Legenda
export const statusLabels = {
  sunday: "Classificado (Domingo)",
  survival: "Mais uma Chance",
  eliminated: "Eliminado",
  playing: "Jogando"
}