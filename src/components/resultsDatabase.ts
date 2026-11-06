import { useSQLiteContext } from "expo-sqlite";

export function useResultsDatabase() {
  return useSQLiteContext();
}
