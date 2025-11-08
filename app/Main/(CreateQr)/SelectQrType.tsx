import { router } from "expo-router";
import {
  Globe,
  Link,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Type,
  Wifi,
} from "lucide-react-native";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

const qrTypes = [
  { id: "wifi", name: "Wi-Fi", icon: Wifi, color: "bg-orange-500" },
  { id: "url", name: "Website URL", icon: Globe, color: "bg-blue-500" },
  { id: "text", name: "Text", icon: Type, color: "bg-purple-500" },
  { id: "email", name: "Email", icon: Mail, color: "bg-red-500" },
  { id: "phone", name: "Phone Number", icon: Phone, color: "bg-green-500" },
  { id: "sms", name: "SMS", icon: Smartphone, color: "bg-teal-500" },
  { id: "location", name: "Location", icon: MapPin, color: "bg-yellow-500" },
  { id: "social", name: "Social Link", icon: Link, color: "bg-pink-500" },
];

export default function SelectQrType() {
  const handleSelect = (type: string) => {
    router.push(`/Main/(CreateQr)/CreateQrScreen?qrType=${type}`);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={qrTypes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <Pressable
              onPress={() => handleSelect(item.id)}
              className="w-[48%] mb-4"
            >
              <View className="bg-gray-50 rounded-2xl p-5 shadow-sm items-center justify-center">
                <View
                  className={`w-14 h-14 rounded-full ${item.color} items-center justify-center mb-3`}
                >
                  <Icon size={28} color="white" />
                </View>
                <Text className="text-gray-900 text-base font-medium">
                  {item.name}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
