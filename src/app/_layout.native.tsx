import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { initializeHistory } from "../components/historyStore";

export default function NativeRootLayout() {
  return (
    <SQLiteProvider databaseName="se-project.db" onInit={initializeHistory}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
