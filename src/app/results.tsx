import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import ResultsPage from "./components/ResultsPage";

export default function Results() {
  const { keywords } = useLocalSearchParams<{ keywords: string }>();
  const list = useMemo(
    () => (keywords ?? "").split(",").filter(Boolean),
    [keywords],
  );

  return (
    <ResultsPage
      keywords={list}
      onBack={() => router.back()}
      onEditKeywords={() => router.back()}
    />
  );
}
