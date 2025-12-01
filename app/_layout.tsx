// app/_layout.tsx (if you must use Stack here)
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Or use the route that is your real index: */}
        <Stack.Screen name="index" /> 
      </Stack>
    </ClerkProvider>
  );
}
