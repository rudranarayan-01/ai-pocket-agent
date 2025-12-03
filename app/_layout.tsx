// app/_layout.tsx (if you must use Stack here)
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        barStyle="dark-content"          // dark text/icons
        backgroundColor="transparent"    // transparent background
        translucent={false}              // avoid content drawing under the status bar
      />
      <ClerkProvider tokenCache={tokenCache}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Or use the route that is your real index: */}
          <Stack.Screen name="index" />
        </Stack>
      </ClerkProvider>
    </>
  );
}
