import type { SQLiteDatabase } from "expo-sqlite";

export type DatabaseResult = {
  id: number;
  name: string;
  organization: string;
  url: string;
  description: string;
  isOpenSource: boolean;
  verifiedAt: number; // unix ms of the last live check
  rank: number;
  relevance: number; // 0-100
};

/**
 * Same keyword set in any order gives the same key (requirement 5).
 * "Space Flight, retina" and "retina, space flight" both become "retina|space flight".
 */
export function toKeywordKey(keywords: string[]): string {
  const clean = keywords.map((k) => k.trim().toLowerCase()).filter(Boolean);
  return Array.from(new Set(clean)).sort().join("|");
}

/*
 Assumed schema (adjust names to match yours):

 CREATE TABLE IF NOT EXISTS searches (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   keyword_key TEXT NOT NULL UNIQUE,
   created_at INTEGER NOT NULL
 );
 CREATE TABLE IF NOT EXISTS databases (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   organization TEXT,
   url TEXT NOT NULL UNIQUE,
   description TEXT,
   is_open_source INTEGER NOT NULL DEFAULT 0,
   is_live INTEGER NOT NULL DEFAULT 0,
   verified_at INTEGER
 );
 CREATE TABLE IF NOT EXISTS search_databases (
   search_id INTEGER NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
   database_id INTEGER NOT NULL REFERENCES databases(id),
   rank INTEGER NOT NULL,
   relevance INTEGER NOT NULL,
   PRIMARY KEY (search_id, database_id)
 );
*/

type Row = {
  id: number;
  name: string;
  organization: string | null;
  url: string;
  description: string | null;
  is_open_source: number;
  verified_at: number | null;
  rank: number;
  relevance: number;
};

/** Saved results for a keyword set. Live databases only, open source first. */
export async function getResultsForKeywords(
  db: SQLiteDatabase,
  keywords: string[],
): Promise<DatabaseResult[]> {
  const rows = await db.getAllAsync<Row>(
    `SELECT d.id, d.name, d.organization, d.url, d.description,
            d.is_open_source, d.verified_at, sd.rank, sd.relevance
       FROM searches s
       JOIN search_databases sd ON sd.search_id = s.id
       JOIN databases d ON d.id = sd.database_id
      WHERE s.keyword_key = ? AND d.is_live = 1
      ORDER BY d.is_open_source DESC, sd.rank ASC`,
    [toKeywordKey(keywords)],
  );

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    organization: r.organization ?? "",
    url: r.url,
    description: r.description ?? "",
    isOpenSource: r.is_open_source === 1,
    verifiedAt: r.verified_at ?? 0,
    rank: r.rank,
    relevance: r.relevance,
  }));
}
