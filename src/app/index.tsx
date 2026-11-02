import { router } from "expo-router";
import SplashPage from "./components/SplashPage";

export default function Index() {
  return (
    <SplashPage
      onSearch={(keywords) =>
        router.push({
          pathname: "/results",
          params: { keywords: keywords.join(",") },
        })
      }
    />
  );
}
