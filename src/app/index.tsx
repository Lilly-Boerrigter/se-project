import { router } from "expo-router";
import SplashPage, { SearchFilters } from "./components/SplashPage";
import React from "react";

export default function Index() {
  return (
    <SplashPage
      onSearch={(keywords, filters: SearchFilters) =>
        router.push({
          pathname: "/results",
          params: {
            keywords: keywords.join(","),
            source: filters.source,
            verified: String(filters.verifiedOnly),
          },
        })
      }
      onHistory={() => router.push("/history")}
    />
  );
}
