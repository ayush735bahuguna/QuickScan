import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false, headerShown: true }}>
      <Stack.Screen
        name="(CreateQr)/CreateQrScreen"
        options={{ title: "Generate Qr" }}
      />
      <Stack.Screen
        name="(CreateQr)/SelectQrType"
        options={{ title: "Qr type" }}
      />
      <Stack.Screen name="History" />
      <Stack.Screen name="Home" options={{ headerShown: false }} />
    </Stack>
  );
}
