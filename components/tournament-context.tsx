"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { TournamentState, Team, Group, Bo3Match, FinalMatch } from "@/lib/types"

interface TournamentContextType {
  state: TournamentState
  loading: boolean
  refreshData: () => Promise<void>
  setCurrentDay: (day: number) => void
  getTeamById: (id: string) => Team | undefined
  addTeam: (team: { name: string; logo: string | null }) => Promise<void>
  deleteTeam: (teamId: string) => Promise<void>
  addTeamToGroup: (groupId: string, teamId: string, position: number) => Promise<void>
  removeTeamFromGroup: (groupId: string, teamId: string) => Promise<void>
  updateTeamCashout: (groupId: string, teamId: string, cashout: number) => Promise<void>
  updateTeamStatus: (groupId: string, teamId: string, status: string) => Promise<void>
  lockGroupAndCreateBo3: (groupId: string) => Promise<void>
  updateGroup: (groupId: string, data: Partial<Group>) => Promise<void>
  updateBo3Match: (matchId: string, data: Partial<Bo3Match>) => Promise<void>
  initFinalMatch: (teamIds: string[]) => Promise<void>
  updateFinalPoints: (teamId: string, points: number) => Promise<void>
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined)

// --- MAPA DE PROGRESSÃO (ÁRVORE DE DECISÃO) ---
// Configuração exata conforme sua regra:
// G1/G2 -> Upper Winner vai pro G9 (Domingo), Upper Loser vai pro G5, Lower Winner vai pro G5.
// G3/G4 -> Upper Winner vai pro G10 (Domingo), Upper Loser vai pro G6, Lower Winner vai pro G6.

interface ProgressionRule {
  upperWinner: string; // Vencedor do 1º vs 2º (Vai para Domingo)
  upperLoser: string;  // Perdedor do 1º vs 2º (Cai para Repescagem)
  lowerWinner: string; // Vencedor do 3º vs 4º (Sobrevive na Repescagem)
}

const PROGRESSION_MAP: Record<string, ProgressionRule> = {
  G1: { upperWinner: "G9", upperLoser: "G5", lowerWinner: "G5" },
  G2: { upperWinner: "G9", upperLoser: "G5", lowerWinner: "G5" },
  G3: { upperWinner: "G10", upperLoser: "G6", lowerWinner: "G6" },
  G4: { upperWinner: "G10", upperLoser: "G6", lowerWinner: "G6" },
  // --- Fase 2: Elimination Round (Sábado) ---
  // Tanto G5 quanto G6 mandam seus times restantes para o G7
  G5: { 
    upperWinner: "G9", // Vai para Domingo
    upperLoser: "G7",   // Cai para G7
    lowerWinner: "G7"   // Cai para G7
  },
  
  G6: { 
    upperWinner: "G10", // Vai para Domingo
    upperLoser: "G7",   // Cai para G7 (Junta com os do G5)
    lowerWinner: "G7"   // Cai para G7 (Junta com os do G5)
  },

  // --- Fase 3: Last Chance (Sábado) ---
  // G7 decide uma vaga direta e manda os outros para o G8 (Mata-mata final)
  G7: {
    upperWinner: "G9", // Vencedor da Upper (1º vs 2º) classifica para Domingo
    upperLoser: "G8",   // Perdedor da Upper cai para o G8
    lowerWinner: "G8"   // Vencedor da Lower cai para o G8
  },

  // G8 é apenas um Bo3 final (decide a última vaga)
  // Como ele é um "Bo3OnlyGroup", consideramos apenas o vencedor
  G8: {
    upperWinner: "G10", // O vencedor do G8 pega a última vaga de Domingo
    upperLoser: "ELIMINATED", // Acabou
    lowerWinner: "ELIMINATED" // Não existe lower em G8 (é só 1 jogo), mas mantemos pra não quebrar
  },
  // --- Fase 4: Top 8 (Quarter-Finals) ---
  // Recebem os classificados de Sábado.
  // Objetivo: Enviar vencedores para a Final (G13) e perdedores para a Repescagem (G11)
  
  G9: {
    upperWinner: "G13", // 1º Classificado para a Final
    upperLoser: "G11",  // Cai para Elimination Quarter-Final
    lowerWinner: "G11"  // Cai para Elimination Quarter-Final
  },

  G10: {
    upperWinner: "G13", // 2º Classificado para a Final
    upperLoser: "G11",  // Cai para Elimination Quarter-Final
    lowerWinner: "G11"  // Cai para Elimination Quarter-Final
  },

  // --- Fase 5: Elimination Quarter-Final (G11) ---
  // Recebe os 4 times que caíram do G9/G10.
  // O Vencedor da Upper vai pra Final. Os outros brigam na Semi (G12).
  
  G11: {
    upperWinner: "G13", // 3º Classificado para a Final (Vencedor da Upper do G11)
    upperLoser: "G12",  // Cai para Elimination Semi-Final (Última chance)
    lowerWinner: "G12"  // Avança para Elimination Semi-Final (Última chance)
  },

  // --- Fase 6: Elimination Semi-Final (G12) ---
  // É um Bo3 único entre os sobreviventes do G11.
  
  G12: { // Bo3OnlyGroup
    upperWinner: "G13", // 4º e Último Classificado para a Final
    upperLoser: "ELIMINATED",
    lowerWinner: "ELIMINATED"
  }
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [currentDay, setCurrentDay] = useState(1)
  const [state, setState] = useState<TournamentState>({
    teams: [],
    groups: [],
    bo3Matches: [],
    finalMatch: null,
    currentDay: 1,
  })

  // --- BUSCAR DADOS DO BANCO ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      // 1. Buscar Times
      const { data: teamsData } = await supabase.from("teams").select("*").order("name")
      
      // 2. Buscar Grupos e Times nos Grupos
      const { data: groupsData } = await supabase
        .from("groups")
        .select(`
          *,
          group_teams (
            team_id, position, cashout, status,
            teams (name, logo_url)
          )
        `)
        .order("id")

      // 3. Buscar Partidas Bo3
      const { data: bo3Data } = await supabase.from("bo3_matches").select("*")

      // 4. Buscar Final
      const { data: finalData } = await supabase
        .from("final_match")
        .select(`*, final_teams(*)`)
        .single()

      // --- TRANSFORMAÇÃO DE DADOS (SQL -> APP) ---
      
      const formattedTeams: Team[] = (teamsData || []).map(t => ({
        id: t.id,
        name: t.name,
        logo: t.logo_url
      }))

      const formattedGroups: Group[] = (groupsData || []).map(g => ({
        id: g.id,
        name: g.name,
        phase: g.phase,
        day: g.day,
        type: g.type as any,
        locked: g.is_locked,
        teams: (g.group_teams || []).map((gt: any) => ({
          teamId: gt.team_id,
          position: gt.position,
          cashout: gt.cashout,
          status: gt.status,
          name: gt.teams?.name || "Unknown",
          logo: gt.teams?.logo_url || null
        }))
      }))

      const formattedBo3: Bo3Match[] = (bo3Data || []).map(b => ({
        id: b.id,
        phase: b.phase,
        day: b.day,
        team1Id: b.team1_id,
        team2Id: b.team2_id,
        team1Wins: b.team1_wins,
        team2Wins: b.team2_wins,
        winnerId: b.winner_id,
        completed: b.completed,
        sourceGroupId: b.source_group,
        matchType: b.match_order === 1 ? "upper" : "lower"
      }))

      let formattedFinal: FinalMatch | null = null
      if (finalData) {
        formattedFinal = {
          id: finalData.id,
          winnerId: finalData.winner_id,
          completed: finalData.completed,
          teams: (finalData.final_teams || []).map((ft: any) => ({
            teamId: ft.team_id,
            points: ft.points
          }))
        }
      }

      setState(prev => ({
        ...prev,
        teams: formattedTeams,
        groups: formattedGroups,
        bo3Matches: formattedBo3,
        finalMatch: formattedFinal
      }))

    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- HELPERS ---
  
  const getTeamById = (id: string) => {
    return state.teams.find((t) => t.id === id)
  }

  // --- ACTIONS ---

  const addTeam = async (team: { name: string; logo: string | null }) => {
    await supabase.from("teams").insert({ name: team.name, logo_url: team.logo })
    fetchData()
  }

  const deleteTeam = async (teamId: string) => {
    await supabase.from("teams").delete().eq("id", teamId)
    fetchData()
  }

  // Função auxiliar interna para mover times (evita duplicação)
  const moveTeamToGroup = async (groupId: string, teamId: string) => {
    // 1. Verifica se o time já está lá
    const { data: existing } = await supabase
        .from("group_teams")
        .select("*")
        .match({ group_id: groupId, team_id: teamId })
        .single();
    
    if (existing) return; // Já foi movido, não faz nada

    // 2. Insere no novo grupo
    await supabase.from("group_teams").insert({
      group_id: groupId,
      team_id: teamId,
      position: 0,
      status: 'playing'
    });
    console.log(`Time ${teamId} movido para ${groupId}`);
  }

  const addTeamToGroup = async (groupId: string, teamId: string, position: number) => {
    await moveTeamToGroup(groupId, teamId);
    fetchData()
  }

  const removeTeamFromGroup = async (groupId: string, teamId: string) => {
    await supabase.from("group_teams").delete().match({ group_id: groupId, team_id: teamId })
    fetchData()
  }

  const updateTeamCashout = async (groupId: string, teamId: string, cashout: number) => {
    await supabase
      .from("group_teams")
      .update({ cashout })
      .match({ group_id: groupId, team_id: teamId })
    
    // Atualização otimista
    const newGroups = state.groups.map(g => {
      if (g.id !== groupId) return g
      return {
        ...g,
        teams: g.teams.map(t => t.teamId === teamId ? { ...t, cashout } : t)
      }
    })
    setState(prev => ({ ...prev, groups: newGroups }))
  }

  const updateTeamStatus = async (groupId: string, teamId: string, status: string) => {
    await supabase
      .from("group_teams")
      .update({ status })
      .match({ group_id: groupId, team_id: teamId })
    fetchData()
  }

  const lockGroupAndCreateBo3 = async (groupId: string) => {
    const group = state.groups.find(g => g.id === groupId)
    if (!group) return

    const sortedTeams = [...group.teams].sort((a, b) => b.cashout - a.cashout)
    if (sortedTeams.length < 4) {
      alert("Precisa de 4 times para fechar o grupo.")
      return
    }

    const { error: lockError } = await supabase
      .from("groups")
      .update({ is_locked: true })
      .eq("id", groupId)
    
    if (lockError) return

    // 1º vs 2º (Upper - Match Order 1)
    const match1 = {
      phase: group.phase,
      day: group.day,
      team1_id: sortedTeams[0].teamId,
      team2_id: sortedTeams[1].teamId,
      source_group: groupId,
      match_order: 1 
    }

    // 3º vs 4º (Lower - Match Order 2)
    const match2 = {
      phase: group.phase,
      day: group.day,
      team1_id: sortedTeams[2].teamId,
      team2_id: sortedTeams[3].teamId,
      source_group: groupId,
      match_order: 2
    }

    await supabase.from("bo3_matches").insert([match1, match2])
    fetchData()
  }

  const updateGroup = async (groupId: string, data: Partial<Group>) => {
    const updateData: any = {}
    if (data.locked !== undefined) updateData.is_locked = data.locked
    
    await supabase.from("groups").update(updateData).eq("id", groupId)
    fetchData()
  }

  // --- ATUALIZAÇÃO DE BO3 COM A LÓGICA DE PROGRESSÃO ---
  const updateBo3Match = async (matchId: string, data: Partial<Bo3Match>) => {
    const updateData: any = {}
    if (data.team1Wins !== undefined) updateData.team1_wins = data.team1Wins
    if (data.team2Wins !== undefined) updateData.team2_wins = data.team2Wins

    let currentMatch = state.bo3Matches.find(m => m.id === matchId)
    
    // Fallback DB lookup
    if (!currentMatch) {
       const { data: dbMatch } = await supabase.from('bo3_matches').select('*').eq('id', matchId).single()
       if(dbMatch) {
         currentMatch = {
           id: dbMatch.id,
           team1Id: dbMatch.team1_id,
           team2Id: dbMatch.team2_id,
           team1Wins: dbMatch.team1_wins,
           team2Wins: dbMatch.team2_wins,
           winnerId: dbMatch.winner_id,
           completed: dbMatch.completed,
           sourceGroupId: dbMatch.source_group,
           matchType: dbMatch.match_order === 1 ? "upper" : "lower",
           phase: dbMatch.phase,
           day: dbMatch.day
         }
       }
    }

    let winnerId: string | null = null
    let loserId: string | null = null
    let isCompleted = false

    if (currentMatch) {
       const t1Wins = data.team1Wins ?? currentMatch.team1Wins
       const t2Wins = data.team2Wins ?? currentMatch.team2Wins
       
       if (t1Wins === 2) {
         winnerId = currentMatch.team1Id
         loserId = currentMatch.team2Id
         updateData.winner_id = winnerId
         updateData.completed = true
         isCompleted = true
       } else if (t2Wins === 2) {
         winnerId = currentMatch.team2Id
         loserId = currentMatch.team1Id
         updateData.winner_id = winnerId
         updateData.completed = true
         isCompleted = true
       }

       // --- PROGRESSÃO AUTOMÁTICA ---
       if (isCompleted && winnerId && loserId && currentMatch.sourceGroupId) {
          const sourceG = currentMatch.sourceGroupId
          const type = currentMatch.matchType // "upper" ou "lower"
          const targets = PROGRESSION_MAP[sourceG]

          if (targets) {
            // REGRA: UPPER MATCH (1º vs 2º)
            if (type === "upper") {
                // VENCEDOR -> Vai para Domingo (G9 ou G10)
                await moveTeamToGroup(targets.upperWinner, winnerId);
                
                // PERDEDOR -> Tem segunda chance no Elimination (G5 ou G6)
                await moveTeamToGroup(targets.upperLoser, loserId);
            } 
            // REGRA: LOWER MATCH (3º vs 4º)
            else if (type === "lower") {
                // VENCEDOR -> Vai para Elimination (G5 ou G6)
                await moveTeamToGroup(targets.lowerWinner, winnerId);
                
                // PERDEDOR -> Está eliminado (Não fazemos nada, ele não é movido pra lugar nenhum)
            }
          }
       }
    }

    await supabase.from("bo3_matches").update(updateData).eq("id", matchId)
    fetchData()
  }

  const initFinalMatch = async (teamIds: string[]) => {
    const { data: final, error } = await supabase
      .from("final_match")
      .insert({ completed: false })
      .select()
      .single()

    if (error || !final) return

    const teamInserts = teamIds.map(tid => ({
      final_id: final.id,
      team_id: tid,
      points: 0
    }))

    await supabase.from("final_teams").insert(teamInserts)
    fetchData()
  }

  const updateFinalPoints = async (teamId: string, points: number) => {
    if (!state.finalMatch) return

    await supabase
      .from("final_teams")
      .update({ points })
      .match({ final_id: state.finalMatch.id, team_id: teamId })

    if (points >= 5) {
      await supabase
        .from("final_match")
        .update({ completed: true, winner_id: teamId })
        .eq("id", state.finalMatch.id)
    }

    fetchData()
  }

  return (
    <TournamentContext.Provider
      value={{
        state: { ...state, currentDay },
        loading,
        refreshData: fetchData,
        setCurrentDay,
        getTeamById,
        addTeam,
        deleteTeam,
        addTeamToGroup,
        removeTeamFromGroup,
        updateTeamCashout,
        updateTeamStatus,
        lockGroupAndCreateBo3,
        updateGroup,
        updateBo3Match,
        initFinalMatch,
        updateFinalPoints,
      }}
    >
      {children}
    </TournamentContext.Provider>
  )
}

export const useTournament = () => {
  const context = useContext(TournamentContext)
  if (context === undefined) {
    throw new Error("useTournament must be used within a TournamentProvider")
  }
  return context
}