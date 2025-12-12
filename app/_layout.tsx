// app/_layout.tsx (if you must use Stack here)
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { useState } from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const [theme, setTheme] = useState("light");
  return (
    <>
      <ClerkProvider tokenCache={tokenCache}>
        <StatusBar
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent={false}
        />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Or use the route that is your real index: */}
          <Stack.Screen name="index" />
        </Stack>
      </ClerkProvider>
    </>
  );
}
