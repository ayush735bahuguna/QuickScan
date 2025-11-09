import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShadowVisible: false, headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Main" />
        <Stack.Screen name="OnboardingScreen" />
      </Stack>
    </GestureHandlerRootView>
  );
}
