import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const Index = () => {
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem("QuickScan_onBoarding");

        if (hasOnboarded === "true") {
          router.replace("/Main/Home");
        } else {
          router.replace("/OnboardingScreen");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        router.replace("/OnboardingScreen");
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    checkOnboardingStatus();
  }, []);

  return null; // We don't render anything while splash is shown
};

export default Index;
