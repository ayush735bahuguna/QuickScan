import { router, Stack } from "expo-router";
import {
  HistoryIcon,
  ImageDown,
  Link,
  Mail,
  MessageSquare,
  Phone,
  Type,
  User,
  Wifi,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const qrTypes = [
  { label: "Text", icon: Type },
  { label: "URL", icon: Link },
  { label: "WiFi", icon: Wifi },
  { label: "Email", icon: Mail },
  { label: "Phone", icon: Phone },
  { label: "SMS", icon: MessageSquare },
  { label: "Contact", icon: User },
];

const CreateQr = () => {
  const [selectedType, setSelectedType] = useState("Text");
  const [inputData, setInputData] = useState({
    text: "",
    ssid: "",
    password: "",
    encryption: "WPA",
    phone: "",
    message: "",
    email: "",
    name: "",
  });

  const qrRef = useRef<QRCode | null>(null);

  const getQrValue = () => {
    switch (selectedType) {
      case "URL":
        return inputData.text || "https://example.com";
      case "WiFi":
        return `WIFI:T:${inputData.encryption};S:${inputData.ssid};P:${inputData.password};;`;
      case "Email":
        return `mailto:${inputData.email}`;
      case "Phone":
        return `tel:${inputData.phone}`;
      case "SMS":
        return `SMSTO:${inputData.phone}:${inputData.message}`;
      case "Contact":
        return `BEGIN:VCARD\nFN:${inputData.name}\nTEL:${inputData.phone}\nEMAIL:${inputData.email}\nEND:VCARD`;
      default:
        return inputData.text || "Hello QR!";
    }
  };

  const renderInputs = () => {
    switch (selectedType) {
      case "WiFi":
        return (
          <>
            <TextInput
              placeholder="Network name (SSID)"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-3 text-gray-700"
              value={inputData.ssid}
              onChangeText={(v) => setInputData({ ...inputData, ssid: v })}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-3 text-gray-700"
              value={inputData.password}
              onChangeText={(v) => setInputData({ ...inputData, password: v })}
            />
            <TextInput
              placeholder="Encryption (WPA/WEP/NONE)"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
              value={inputData.encryption}
              onChangeText={(v) =>
                setInputData({ ...inputData, encryption: v })
              }
            />
          </>
        );
      case "Email":
        return (
          <TextInput
            placeholder="Enter Email"
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
            value={inputData.email}
            onChangeText={(v) => setInputData({ ...inputData, email: v })}
            keyboardType="email-address"
          />
        );
      case "Phone":
        return (
          <TextInput
            placeholder="Enter Phone Number"
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
            value={inputData.phone}
            onChangeText={(v) => setInputData({ ...inputData, phone: v })}
            keyboardType="phone-pad"
          />
        );
      case "SMS":
        return (
          <>
            <TextInput
              placeholder="Phone Number"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-3 text-gray-700"
              value={inputData.phone}
              onChangeText={(v) => setInputData({ ...inputData, phone: v })}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Message"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
              value={inputData.message}
              onChangeText={(v) => setInputData({ ...inputData, message: v })}
            />
          </>
        );
      case "Contact":
        return (
          <>
            <TextInput
              placeholder="Full Name"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-3 text-gray-700"
              value={inputData.name}
              onChangeText={(v) => setInputData({ ...inputData, name: v })}
            />
            <TextInput
              placeholder="Phone Number"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-3 text-gray-700"
              value={inputData.phone}
              onChangeText={(v) => setInputData({ ...inputData, phone: v })}
            />
            <TextInput
              placeholder="Email"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
              value={inputData.email}
              onChangeText={(v) => setInputData({ ...inputData, email: v })}
              keyboardType="email-address"
            />
          </>
        );
      default:
        return (
          <TextInput
            placeholder="Enter text or URL"
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
            value={inputData.text}
            onChangeText={(v) => setInputData({ ...inputData, text: v })}
          />
        );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ backgroundColor: "white", flex: 1 }}
    >
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <Pressable onPress={() => router.push("/History")}>
                <HistoryIcon />
              </Pressable>
            );
          },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-10 bg-white mb-safe-offset-0">
          <View className="items-center mb-5 relative">
            <View className="p-4 bg-gray-100 shadow-lg rounded-lg">
              <QRCode
                value={getQrValue()}
                size={200}
                color="black"
                backgroundColor="#f3f4f6"
                getRef={(c) => (qrRef.current = c)}
              />
              <TouchableOpacity className="bg-blue-600 p-3 rounded-full shadow-lg absolute -right-5 -bottom-5">
                <ImageDown size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="w-full mt-8 rounded-2xl p-4">
              <View className="flex-row items-center mb-3">
                {React.createElement(
                  qrTypes.find((t) => t.label === selectedType)?.icon || Type,
                  { size: 22, color: "#2563eb" }
                )}
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  {selectedType} QR
                </Text>
              </View>

              {/* Dynamic Inputs */}
              {renderInputs()}
            </View>
          </View>

          <Text className="text-base font-semibold mb-2 text-gray-800">
            Select Type
          </Text>
          <View className="flex-row flex-wrap mb-4">
            {qrTypes.map((type) => (
              <TouchableOpacity
                key={type.label}
                className={`flex-row items-center px-4 py-2 rounded-full border mb-2 mr-2 ${
                  selectedType === type.label
                    ? "bg-blue-600 border-blue-600"
                    : "border-blue-400"
                }`}
                onPress={() => setSelectedType(type.label)}
              >
                <type.icon
                  size={16}
                  color={selectedType === type.label ? "white" : "#2563eb"}
                />
                <Text
                  className={`ml-1 text-sm font-medium ${
                    selectedType === type.label ? "text-white" : "text-blue-600"
                  }`}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateQr;
