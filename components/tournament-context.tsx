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
  
  // Funções da Final
  initFinalMatch: (teamIds: string[]) => Promise<void>
  updateFinalPoints: (teamId: string, points: number) => Promise<void>
  startNewRound: (finalId: string) => Promise<void>
  submitCashoutResults: (roundId: string, cashoutData: Record<string, number>) => Promise<void>
  submitBo3Results: (roundId: string, team1Id: string, team2Id: string, score1: number, score2: number) => Promise<void>
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined)

// --- MAPA DE PROGRESSÃO ---
const PROGRESSION_MAP: Record<string, { upperWinner: string; upperLoser: string; lowerWinner?: string }> = {
  G1: { upperWinner: "G9", upperLoser: "G5", lowerWinner: "G5" },
  G2: { upperWinner: "G9", upperLoser: "G5", lowerWinner: "G5" },
  G3: { upperWinner: "G10", upperLoser: "G6", lowerWinner: "G6" },
  G4: { upperWinner: "G10", upperLoser: "G6", lowerWinner: "G6" },
  G5: { upperWinner: "G9", upperLoser: "G7", lowerWinner: "G7" },
  G6: { upperWinner: "G10", upperLoser: "G7", lowerWinner: "G7" },
  G7: { upperWinner: "G9", upperLoser: "G8", lowerWinner: "G8" },
  G8: { upperWinner: "G10", upperLoser: "ELIMINATED" },
  G9: { upperWinner: "G13", upperLoser: "G11", lowerWinner: "G11" },
  G10: { upperWinner: "G13", upperLoser: "G11", lowerWinner: "G11" },
  G11: { upperWinner: "G13", upperLoser: "G12", lowerWinner: "G12" },
  G12: { upperWinner: "G13", upperLoser: "ELIMINATED", lowerWinner: "ELIMINATED" }
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [currentDay, setCurrentDay] = useState(1)
  const [state, setState] = useState<TournamentState>({
    teams: [], groups: [], bo3Matches: [], finalMatch: null, currentDay: 1,
  })

  // --- FUNÇÃO RESTAURADA: AUTO-CORREÇÃO (SYNC) ---
  // Essa função garante que a tabela 'final_teams' seja preenchida com quem está no G13
  const repairFinalTeams = async (groupsData: any[], finalId: string) => {
    // Procura pelo Grupo 13 (pode ser maiúsculo ou minúsculo)
    const g13 = groupsData.find(g => g.id === 'G13' || g.id === 'g13' || g.name === 'G13');
    
    if (!g13 || !g13.group_teams) return;

    // Pega IDs dos times que estão no G13 fisicamente
    const teamsInG13 = g13.group_teams.map((gt: any) => gt.team_id);
    
    // Busca times que já estão na tabela da Final
    const { data: currentFinalTeams } = await supabase.from("final_teams").select("team_id").eq("final_id", finalId);
    const existingIds = currentFinalTeams?.map((ft: any) => ft.team_id) || [];

    // Encontra quem falta
    const missingTeams = teamsInG13.filter((tid: string) => !existingIds.includes(tid));

    if (missingTeams.length > 0) {
      console.log("🛠️ Auto-corrigindo times da Final:", missingTeams);
      const inserts = missingTeams.map((tid: string) => ({
        final_id: finalId,
        team_id: tid,
        points: 0
      }));
      await supabase.from("final_teams").insert(inserts);
    }
  }

  // --- FUNÇÃO RESTAURADA: SYNC MANUAL ---
  const syncTeamToFinalTable = async (teamId: string) => {
    let { data: final } = await supabase.from("final_match").select("id").single()
    if (!final) {
        const { data: newFinal } = await supabase.from("final_match").insert({ completed: false }).select("id").single()
        final = newFinal
    }
    if (!final) return
    const { data: existing } = await supabase.from("final_teams").select("*").match({ final_id: final.id, team_id: teamId }).single()
    if (!existing) {
        await supabase.from("final_teams").insert({ final_id: final.id, team_id: teamId, points: 0 })
    }
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const { data: teamsData } = await supabase.from("teams").select("*").order("name")
      const { data: groupsData } = await supabase.from("groups").select(`*, group_teams (team_id, position, cashout, status, teams (name, logo_url))`).order("id")
      const { data: bo3Data } = await supabase.from("bo3_matches").select("*")
      
      let { data: finalData } = await supabase.from("final_match")
        .select(`*, final_teams(*), final_rounds(*)`)
        .single()

      // --- LÓGICA DE RECUPERAÇÃO ---
      // 1. Se não existir Final, cria uma.
      if (!finalData) {
         const { data: newFinal } = await supabase.from("final_match").insert({ completed: false }).select().single()
         finalData = newFinal
      }

      // 2. Tenta reparar os times (Copiar do G13 para a Final se estiver faltando)
      if (finalData && groupsData) {
         await repairFinalTeams(groupsData, finalData.id);
      }

      // Removemos aquela lógica que deletava a final se estivesse vazia, 
      // pois agora o repairFinalTeams vai tentar preenchê-la.

      const formattedTeams: Team[] = (teamsData || []).map(t => ({ id: t.id, name: t.name, logo: t.logo_url }))
      const formattedGroups: Group[] = (groupsData || []).map(g => ({
        id: g.id, name: g.name, phase: g.phase, day: g.day, type: g.type as any, locked: g.is_locked,
        teams: (g.group_teams || []).map((gt: any) => ({
          teamId: gt.team_id, position: gt.position, cashout: gt.cashout, status: gt.status,
          name: gt.teams?.name || "Unknown", logo: gt.teams?.logo_url || null
        })).sort((a, b) => b.cashout - a.cashout)
      }))
      const formattedBo3: Bo3Match[] = (bo3Data || []).map(b => ({
        id: b.id, phase: b.phase, day: b.day, team1Id: b.team1_id, team2Id: b.team2_id, team1Wins: b.team1_wins, team2Wins: b.team2_wins, winnerId: b.winner_id, completed: b.completed, sourceGroupId: b.source_group, matchType: b.match_order === 1 ? "upper" : "lower"
      }))
      
      let formattedFinal: FinalMatch | null = null
      if (finalData) {
        formattedFinal = {
          id: finalData.id, winnerId: finalData.winner_id, completed: finalData.completed,
          teams: (finalData.final_teams || []).map((ft: any) => ({ teamId: ft.team_id, points: ft.points })),
          rounds: (finalData.final_rounds || [])
            .map((fr: any) => ({ id: fr.id, finalId: fr.final_id, roundNumber: fr.round_number, stage: fr.stage, status: fr.status, results: fr.results }))
            .sort((a: any, b: any) => a.roundNumber - b.roundNumber)
        }
      }
      setState(prev => ({ ...prev, teams: formattedTeams, groups: formattedGroups, bo3Matches: formattedBo3, finalMatch: formattedFinal }))
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const getTeamById = (id: string) => state.teams.find((t) => t.id === id)
  const addTeam = async (team: { name: string; logo: string | null }) => { await supabase.from("teams").insert({ name: team.name, logo_url: team.logo }); fetchData() }
  const deleteTeam = async (teamId: string) => { await supabase.from("teams").delete().eq("id", teamId); fetchData() }
  
  const addTeamToGroup = async (groupId: string, teamId: string, position: number) => {
    // 1. Adiciona ao grupo normal
    const { data: existing } = await supabase.from("group_teams").select("*").match({ group_id: groupId, team_id: teamId }).single();
    if (!existing) await supabase.from("group_teams").insert({ group_id: groupId, team_id: teamId, position: 0, cashout: 0, status: 'playing' });
    
    // 2. RESTAURADO: Se for G13, sincroniza com Final automaticamente
    const group = state.groups.find(g => g.id === groupId)
    if (group?.name === 'G13' || groupId.toUpperCase() === 'G13') {
        await syncTeamToFinalTable(teamId)
    }

    if (group?.type === 'bo3') setTimeout(() => checkAndCreateBo3ForGroup(groupId), 500)
    fetchData()
  }

  const removeTeamFromGroup = async (groupId: string, teamId: string) => { await supabase.from("group_teams").delete().match({ group_id: groupId, team_id: teamId }); fetchData() }
  const updateTeamCashout = async (groupId: string, teamId: string, cashout: number) => { await supabase.from("group_teams").update({ cashout }).match({ group_id: groupId, team_id: teamId }); fetchData() }
  const updateTeamStatus = async (groupId: string, teamId: string, status: string) => { await supabase.from("group_teams").update({ status }).match({ group_id: groupId, team_id: teamId }); fetchData() }
  
  const checkAndCreateBo3ForGroup = async (groupId: string) => {
    const { data: groupTeams } = await supabase.from("group_teams").select("team_id").eq("group_id", groupId)
    if (!groupTeams || groupTeams.length < 2) return 
    const { data: existingMatch } = await supabase.from("bo3_matches").select("id").eq("source_group", groupId).single()
    if (existingMatch) return 
    const group = state.groups.find(g => g.id === groupId)
    if (!group) return
    await supabase.from("bo3_matches").insert({ phase: group.phase, day: group.day, team1_id: groupTeams[0].team_id, team2_id: groupTeams[1].team_id, source_group: groupId, match_order: 1 })
    await updateGroup(groupId, { locked: true })
    fetchData()
  }

  const lockGroupAndCreateBo3 = async (groupId: string) => {
    const group = state.groups.find(g => g.id === groupId)
    if (!group) return

    // 1. SEGURANÇA: Verifica se já existem partidas (evita duplicação e erro 500)
    const existingMatches = state.bo3Matches.filter(m => m.sourceGroupId === groupId);
    if (existingMatches.length > 0) { 
        await updateGroup(groupId, { locked: true }); 
        return; 
    }

    // 2. Ordena os times por Cashout
    const sortedTeams = [...group.teams].sort((a, b) => b.cashout - a.cashout)
    if (sortedTeams.length < 4) { alert("Precisa de 4 times para fechar o grupo."); return }

    await updateGroup(groupId, { locked: true })

    // --- NOVA REGRA: SE FOR G7, MANDA PRO G8 ---
    if (group.name === 'G7') {
        const g8 = state.groups.find(g => g.name === 'G8')
        if (g8) {
            // Move os times para o G8 (só visualmente no banco)
            for (const team of sortedTeams) await addTeamToGroup(g8.id, team.teamId, 0)
            
            // CRIA AS PARTIDAS VINCULADAS AO G8
            await supabase.from("bo3_matches").insert([
                { 
                    phase: "LAST CHANCE", 
                    day: 1, 
                    source_group: g8.id, // <--- O PULO DO GATO: Vincula ao G8
                    match_order: 1, 
                    team1_id: sortedTeams[0].teamId, 
                    team2_id: sortedTeams[1].teamId 
                },
                { 
                    phase: "LAST CHANCE", 
                    day: 1, 
                    source_group: g8.id, // <--- O PULO DO GATO: Vincula ao G8
                    match_order: 2, 
                    team1_id: sortedTeams[2].teamId, 
                    team2_id: sortedTeams[3].teamId 
                }
            ])
            fetchData(); 
            return
        }
    }

    // --- REGRA PADRÃO (G1, G2, G3, G4, G5, G6) ---
    // Cria partidas vinculadas ao próprio grupo
    await supabase.from("bo3_matches").insert([
      { phase: group.phase, day: group.day, team1_id: sortedTeams[0].teamId, team2_id: sortedTeams[1].teamId, source_group: groupId, match_order: 1 },
      { phase: group.phase, day: group.day, team1_id: sortedTeams[2].teamId, team2_id: sortedTeams[3].teamId, source_group: groupId, match_order: 2 }
    ])
    
    fetchData()
  }

  const updateGroup = async (groupId: string, data: Partial<Group>) => {
    const updateData: any = {}
    if (data.locked !== undefined) updateData.is_locked = data.locked
    await supabase.from("groups").update(updateData).eq("id", groupId)
    fetchData()
  }

  const updateBo3Match = async (matchId: string, data: Partial<Bo3Match>) => {
    const updateData: any = {}
    if (data.team1Wins !== undefined) updateData.team1_wins = data.team1Wins
    if (data.team2Wins !== undefined) updateData.team2_wins = data.team2Wins
    let currentMatch = state.bo3Matches.find(m => m.id === matchId)
    if (!currentMatch) {
       const { data: dbMatch } = await supabase.from('bo3_matches').select('*').eq('id', matchId).single()
       if (dbMatch) currentMatch = { ...dbMatch, team1Id: dbMatch.team1_id, team2Id: dbMatch.team2_id, team1Wins: dbMatch.team1_wins, team2Wins: dbMatch.team2_wins, winnerId: dbMatch.winner_id, sourceGroupId: dbMatch.source_group, matchType: dbMatch.match_order === 1 ? "upper" : "lower" } as Bo3Match
    }
    let winnerId: string | null = null; let loserId: string | null = null; let isCompleted = false
    if (currentMatch) {
       const t1Wins = data.team1Wins ?? currentMatch.team1Wins
       const t2Wins = data.team2Wins ?? currentMatch.team2Wins
       if (t1Wins === 2) { winnerId = currentMatch.team1Id; loserId = currentMatch.team2Id; isCompleted = true } 
       else if (t2Wins === 2) { winnerId = currentMatch.team2Id; loserId = currentMatch.team1Id; isCompleted = true }
       if (isCompleted && winnerId && loserId) {
          updateData.winner_id = winnerId; updateData.completed = true
          if (currentMatch.sourceGroupId) {
            const rule = PROGRESSION_MAP[currentMatch.sourceGroupId]
            if (rule) {
                if (currentMatch.matchType === "upper") {
                    await moveTeamToGroupByName(rule.upperWinner, winnerId)
                    if (rule.upperLoser !== "ELIMINATED") await moveTeamToGroupByName(rule.upperLoser, loserId)
                    else await updateTeamStatus(currentMatch.sourceGroupId, loserId, 'eliminated')
                } else if (currentMatch.matchType === "lower" && rule.lowerWinner) {
                    await moveTeamToGroupByName(rule.lowerWinner, winnerId)
                    await updateTeamStatus(currentMatch.sourceGroupId, loserId, 'eliminated')
                }
            }
          }
       }
    }
    await supabase.from("bo3_matches").update(updateData).eq("id", matchId)
    fetchData()
  }

  const moveTeamToGroupByName = async (groupName: string, teamId: string) => {
    const group = state.groups.find(g => g.name === groupName || g.id === groupName)
    if (group) await addTeamToGroup(group.id, teamId, 0)
    else await addTeamToGroup(groupName, teamId, 0)
  }

  const initFinalMatch = async (teamIds: string[]) => {
    const { data: final, error } = await supabase.from("final_match").insert({ completed: false }).select().single()
    if (error || !final) return
    const teamInserts = teamIds.map(tid => ({ final_id: final.id, team_id: tid, points: 0 }))
    await supabase.from("final_teams").insert(teamInserts)
    await startNewRound(final.id)
  }

  const updateFinalPoints = async (teamId: string, points: number) => {
    if (!state.finalMatch) return
    await supabase.from("final_teams").update({ points }).match({ final_id: state.finalMatch.id, team_id: teamId })
    if (points >= 5) await supabase.from("final_match").update({ completed: true, winner_id: teamId }).eq("id", state.finalMatch.id)
    fetchData()
  }

  const startNewRound = async (finalId: string) => {
     const currentRounds = state.finalMatch?.rounds || [];
     const maxRound = currentRounds.length > 0 ? Math.max(...currentRounds.map((r: any) => r.roundNumber)) : 0;
     await supabase.from("final_rounds").insert({ final_id: finalId, round_number: maxRound + 1, stage: 'cashout', status: 'active', results: {} })
     fetchData()
  }

  const submitCashoutResults = async (roundId: string, cashoutData: Record<string, number>) => {
    await supabase.from("final_rounds").update({ results: cashoutData, status: 'completed' }).eq("id", roundId)
    const sortedTeams = Object.entries(cashoutData).sort(([, a], [, b]) => b - a).slice(0, 2)
    const top2Ids = sortedTeams.map(([id]) => id)
    const currentFinal = state.finalMatch!
    const currentRounds = state.finalMatch?.rounds || [];
    const maxRound = currentRounds.length > 0 ? Math.max(...currentRounds.map((r: any) => r.roundNumber)) : 0;
    await supabase.from("final_rounds").insert({ final_id: currentFinal.id, round_number: maxRound + 1, stage: 'bo3', status: 'active', results: { team1Id: top2Ids[0], team2Id: top2Ids[1] } })
    fetchData()
  }

  const submitBo3Results = async (roundId: string, team1Id: string, team2Id: string, score1: number, score2: number) => {
    const currentFinal = state.finalMatch!
    
    // 1. Fecha o Round Atual
    await supabase.from("final_rounds").update({
        status: 'completed', 
        results: { ...currentFinal.rounds.find((r:any) => r.id === roundId)?.results, score1, score2 }
    }).eq("id", roundId)

    // 2. Atualiza Pontos do Time 1 (+ score1)
    const t1 = currentFinal.teams.find(t => t.teamId === team1Id)
    const newPoints1 = (t1?.points || 0) + score1
    await supabase.from("final_teams").update({ points: newPoints1 }).match({ final_id: currentFinal.id, team_id: team1Id })

    // 3. Atualiza Pontos do Time 2 (+ score2)
    const t2 = currentFinal.teams.find(t => t.teamId === team2Id)
    const newPoints2 = (t2?.points || 0) + score2
    await supabase.from("final_teams").update({ points: newPoints2 }).match({ final_id: currentFinal.id, team_id: team2Id })

    // 4. Verifica Campeão
    let winnerId = null;
    if (newPoints1 >= 5) winnerId = team1Id;
    else if (newPoints2 >= 5) winnerId = team2Id;

    if (winnerId) {
        await supabase.from("final_match").update({ completed: true, winner_id: winnerId }).eq("id", currentFinal.id)
    } else {
        // Se ninguém ganhou, começa novo ciclo
        await startNewRound(currentFinal.id)
    }
    
    fetchData()
  }

  return (
    <TournamentContext.Provider value={{ state: { ...state, currentDay }, loading, refreshData: fetchData, setCurrentDay, getTeamById, addTeam, deleteTeam, addTeamToGroup, removeTeamFromGroup, updateTeamCashout, updateTeamStatus, lockGroupAndCreateBo3, updateGroup, updateBo3Match, initFinalMatch, updateFinalPoints, startNewRound, submitCashoutResults, submitBo3Results }}>
      {children}
    </TournamentContext.Provider>
  )
}

export const useTournament = () => {
  const context = useContext(TournamentContext)
  if (context === undefined) throw new Error("useTournament must be used within a TournamentProvider")
  return context
}