-- =====================================================
-- THE FINALS SA SHOWDOWN - Database Schema
-- =====================================================

-- Tabela de Times
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Grupos
-- Added type column for cashout/bo3/final
CREATE TABLE IF NOT EXISTS groups (
    id VARCHAR(10) PRIMARY KEY, -- G1, G2, G3, etc.
    name VARCHAR(255) NOT NULL,
    phase VARCHAR(50) NOT NULL,
    day INTEGER NOT NULL DEFAULT 1, -- 1 = Sábado, 2 = Domingo
    type VARCHAR(20) NOT NULL DEFAULT 'cashout', -- 'cashout', 'bo3', 'final'
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Times em Grupos (relacionamento)
-- Renamed points to cashout for clarity
CREATE TABLE IF NOT EXISTS group_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id VARCHAR(10) REFERENCES groups(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    cashout INTEGER NOT NULL DEFAULT 0, -- Dinheiro extraído no Cashout
    status VARCHAR(20) DEFAULT 'playing', -- 'playing', 'advanced', 'lastChance', 'eliminated'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, team_id)
);

-- Tabela de Partidas Best of 3
-- New table for Bo3 matches
CREATE TABLE IF NOT EXISTS bo3_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase VARCHAR(50) NOT NULL,
    day INTEGER NOT NULL DEFAULT 1,
    team1_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    team2_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    team1_wins INTEGER DEFAULT 0 CHECK (team1_wins >= 0 AND team1_wins <= 2),
    team2_wins INTEGER DEFAULT 0 CHECK (team2_wins >= 0 AND team2_wins <= 2),
    winner_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    completed BOOLEAN DEFAULT FALSE,
    source_group VARCHAR(10),
    match_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Final (primeiro a 5 pontos)
-- New table for the final match
CREATE TABLE IF NOT EXISTS final_match (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    winner_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Times na Final
CREATE TABLE IF NOT EXISTS final_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    final_id UUID REFERENCES final_match(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0 CHECK (points >= 0 AND points <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(final_id, team_id)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_group_teams_group ON group_teams(group_id);
CREATE INDEX IF NOT EXISTS idx_group_teams_team ON group_teams(team_id);
CREATE INDEX IF NOT EXISTS idx_bo3_matches_day ON bo3_matches(day);
CREATE INDEX IF NOT EXISTS idx_final_teams_final ON final_teams(final_id);

-- =====================================================
-- DADOS INICIAIS DOS GRUPOS
-- Updated with correct types (cashout/bo3/final)
-- =====================================================

-- Dia 1 - Sábado
INSERT INTO groups (id, name, phase, day, type) VALUES 
    ('G1', 'G1', 'WINNERS TOP 16', 1, 'cashout'),
    ('G2', 'G2', 'WINNERS TOP 16', 1, 'cashout'),
    ('G3', 'G3', 'WINNERS TOP 16', 1, 'cashout'),
    ('G4', 'G4', 'WINNERS TOP 16', 1, 'cashout'),
    ('G5', 'G5', 'ELIMINATION ROUND', 1, 'cashout'),
    ('G6', 'G6', 'ELIMINATION ROUND', 1, 'cashout'),
    ('G7', 'G7', 'LAST CHANCE', 1, 'cashout'),
    ('G8', 'G8', 'LAST CHANCE', 1, 'bo3')
ON CONFLICT (id) DO NOTHING;

-- Dia 2 - Domingo
INSERT INTO groups (id, name, phase, day, type) VALUES 
    ('G9', 'G9', 'TOP 8', 2, 'cashout'),
    ('G10', 'G10', 'TOP 8', 2, 'cashout'),
    ('G11', 'G11', 'ELIMINATION QUARTER-FINAL', 2, 'cashout'),
    ('G12', 'G12', 'ELIMINATION SEMI-FINAL', 2, 'bo3'),
    ('G13', 'G13', 'THE FINAL', 2, 'final')
ON CONFLICT (id) DO NOTHING;
