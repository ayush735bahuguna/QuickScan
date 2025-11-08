import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false, headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Main" />
      <Stack.Screen name="OnboardingScreen" />
    </Stack>
  );
}
