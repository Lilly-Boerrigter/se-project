import { router } from "expo-router";
import SplashPage from "./components/SplashPage";
import React from "react";

export default function Index() {
  return (
    <SplashPage
      onSearch={(keywords) =>
        router.push({
          pathname: "/results",
          params: { keywords: keywords.join(",") },
        })
      }
      onHistory={() => router.push("/history")}
    />
  );
}
