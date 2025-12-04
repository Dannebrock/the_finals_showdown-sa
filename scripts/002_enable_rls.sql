-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE bo3_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_match ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_teams ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Public read access for teams" ON teams;
DROP POLICY IF EXISTS "Public read access for groups" ON groups;
DROP POLICY IF EXISTS "Public read access for group_teams" ON group_teams;
DROP POLICY IF EXISTS "Public read access for bo3_matches" ON bo3_matches;
DROP POLICY IF EXISTS "Public read access for final_match" ON final_match;
DROP POLICY IF EXISTS "Public read access for final_teams" ON final_teams;

-- Políticas de leitura pública (todos podem visualizar)
CREATE POLICY "Public read access for teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access for groups" ON groups FOR SELECT USING (true);
CREATE POLICY "Public read access for group_teams" ON group_teams FOR SELECT USING (true);
CREATE POLICY "Public read access for bo3_matches" ON bo3_matches FOR SELECT USING (true);
CREATE POLICY "Public read access for final_match" ON final_match FOR SELECT USING (true);
CREATE POLICY "Public read access for final_teams" ON final_teams FOR SELECT USING (true);

-- Drop existing write policies
DROP POLICY IF EXISTS "Service role write access for teams" ON teams;
DROP POLICY IF EXISTS "Service role write access for groups" ON groups;
DROP POLICY IF EXISTS "Service role write access for group_teams" ON group_teams;
DROP POLICY IF EXISTS "Service role write access for bo3_matches" ON bo3_matches;
DROP POLICY IF EXISTS "Service role write access for final_match" ON final_match;
DROP POLICY IF EXISTS "Service role write access for final_teams" ON final_teams;

-- Políticas de escrita (service role pode escrever)
CREATE POLICY "Service role write access for teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role write access for groups" ON groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role write access for group_teams" ON group_teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role write access for bo3_matches" ON bo3_matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role write access for final_match" ON final_match FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role write access for final_teams" ON final_teams FOR ALL USING (true) WITH CHECK (true);
