import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import ResultsPage from "./components/ResultsPage";
import React from "react";
import { useResultsDatabase } from "../components/resultsDatabase";
import { recordHistory, updateHistoryResults } from "../components/historyStore";
import type { DatabaseResult } from "./components/resultsRepo";

export default function Results() {
  const { keywords } = useLocalSearchParams<{ keywords: string }>();
  const list = useMemo(
    () => (keywords ?? "").split(",").filter(Boolean),
    [keywords],
  );
  const db = useResultsDatabase();
  const handleResultsLoaded = useCallback(
    (results: DatabaseResult[]) => {
      void updateHistoryResults(db, list, results.length > 0);
    },
    [db, list],
  );

  React.useEffect(() => {
    void recordHistory(db, list);
  }, [db, list]);

  return (
    <ResultsPage
      keywords={list}
      onBack={() => router.back()}
      onEditKeywords={() => router.back()}
      onResultsLoaded={handleResultsLoaded}
    />
  );
}
