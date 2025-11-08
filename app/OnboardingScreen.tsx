import { router } from "expo-router";
import { Layers, QrCode, Settings } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function OnboardingScreen() {
  const handleContinue = () => {
    router.replace("/Main/Home");
  };
  return (
    <ScrollView contentContainerClassName="bg-white flex-1">
      <View className="flex-1 items-center justify-between px-6 my-safe-offset-5">
        <View className="mt-5">
          <Text className="text-4xl font-semibold text-gray-900 mb-2">
            Welcome to
          </Text>
          <Text className="text-4xl font-extrabold text-blue-600">
            QuickScan
          </Text>
        </View>

        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 70, height: 70 }}
          className="rounded-2xl m-2"
        />

        <View className="w-full gap-8">
          <View className="flex-row items-start gap-4">
            <View className="bg-blue-100 p-3 rounded-xl">
              <QrCode color="#2563eb" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Create QR Instantly
              </Text>
              <Text className="text-gray-600">
                Generate custom QR codes for Wi-Fi, links, text, and more in one
                tap.
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-4">
            <View className="bg-purple-100 p-3 rounded-xl">
              <Layers color="#7c3aed" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Organize Easily
              </Text>
              <Text className="text-gray-600">
                Manage your saved QR codes and access them anytime.
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-4">
            <View className="bg-green-100 p-3 rounded-xl">
              <Settings color="#16a34a" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Customize Designs
              </Text>
              <Text className="text-gray-600">
                Change QR color, style, and add your own brand logo easily.
              </Text>
            </View>
          </View>
        </View>
        <View />

        <View className="w-full">
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.8}
            className="bg-blue-600 rounded-full py-4 mt-2 w-full shadow-md"
          >
            <Text className="text-center text-white text-lg font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
