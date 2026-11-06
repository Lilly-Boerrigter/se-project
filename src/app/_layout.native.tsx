import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";

export default function NativeRootLayout() {
  return (
    <SQLiteProvider databaseName="se-project.db">
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
