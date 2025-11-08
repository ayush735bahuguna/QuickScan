import { useNavigation } from "@react-navigation/native";
import { Info, Layers, QrCode, Settings } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate("SelectQrType" as never);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-6 pt-24 pb-12">
        {/* Header */}
        <Text className="text-3xl font-semibold text-gray-900 mb-2">
          Welcome to
        </Text>
        <Text className="text-4xl font-extrabold text-blue-600 mb-10">
          QR Master
        </Text>

        {/* Features */}
        <View className="w-full space-y-8">
          {/* Create QR */}
          <View className="flex-row items-start space-x-4">
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

          {/* Organize */}
          <View className="flex-row items-start space-x-4">
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

          {/* Customize */}
          <View className="flex-row items-start space-x-4">
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

        {/* Info and Continue */}
        <View className="mt-16 items-center">
          <View className="flex-row items-center space-x-2 mb-3">
            <Info size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm text-center">
              By continuing, you agree to our{" "}
              <Text className="text-blue-600 underline">Terms of Service</Text>{" "}
              and{" "}
              <Text className="text-blue-600 underline">Privacy Policy</Text>.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.8}
            className="w-full bg-blue-600 rounded-full py-4 mt-2 shadow-md"
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
