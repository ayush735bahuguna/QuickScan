import { router } from "expo-router";
import React from "react";
import { Button, View } from "react-native";

const index = () => {
  return (
    <View className="h-screen flex items-center justify-center gap-2 flex-row">
      <Button
        title="Onboarding"
        onPress={() => router.push("/OnboardingScreen")}
      />
      <Button title="Home" onPress={() => router.push("/Main/Home")} />
    </View>
  );
};

export default index;
