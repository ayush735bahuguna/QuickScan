import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { router, Stack, useLocalSearchParams } from "expo-router";
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
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";

const qrTypes = [
  { label: "text", icon: Type },
  { label: "url", icon: Link },
  { label: "wifi", icon: Wifi },
  { label: "email", icon: Mail },
  { label: "phone", icon: Phone },
  { label: "sms", icon: MessageSquare },
  { label: "contact", icon: User },
];

const CreateQrScreen = () => {
  const { qrType } = useLocalSearchParams();
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
  const [format, setFormat] = useState("png");

  const handleDownload = async () => {
    try {
      if (!inputData) {
        Alert.alert("Enter some text first!");
        return;
      }

      // const { status } = await MediaLibrary.requestPermissionsAsync(false, [
      //   "photo",
      // ]);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow gallery access");
        return;
      }

      const uri = await captureRef(qrRef, {
        format: format === "jpg" ? "jpg" : "png",
        quality: 1,
      });

      let fileUri = uri;
      let filename = `QRCode_${Date.now()}.${format}`;

      // Convert to PDF if selected
      if (format === "pdf") {
        const pdfPath = FileSystem.Directory + filename;
        await FileSystem.writeAsStringAsync(pdfPath, uri, {
          encoding: "base64",
        });
        fileUri = pdfPath;
      }

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("QR Codes", asset, false);

      Alert.alert("Saved!", `QR code saved as ${format.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save QR code.");
    }
  };

  const getQrValue = () => {
    switch (qrType) {
      case "url":
        return inputData.text || "https://example.com";
      case "wifi":
        return `WIFI:T:${inputData.encryption};S:${inputData.ssid};P:${inputData.password};;`;
      case "email":
        return `mailto:${inputData.email}`;
      case "phone":
        return `tel:${inputData.phone}`;
      case "sms":
        return `SMSTO:${inputData.phone}:${inputData.message}`;
      case "contact":
        return `BEGIN:VCARD\nFN:${inputData.name}\nTEL:${inputData.phone}\nEMAIL:${inputData.email}\nEND:VCARD`;
      default:
        return inputData.text || "Hello QR!";
    }
  };

  const renderInputs = () => {
    switch (qrType) {
      case "wifi":
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
      case "email":
        return (
          <TextInput
            placeholder="Enter Email"
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
            value={inputData.email}
            onChangeText={(v) => setInputData({ ...inputData, email: v })}
            keyboardType="email-address"
          />
        );
      case "phone":
        return (
          <TextInput
            placeholder="Enter Phone Number"
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
            value={inputData.phone}
            onChangeText={(v) => setInputData({ ...inputData, phone: v })}
            keyboardType="phone-pad"
          />
        );
      case "sms":
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
      case "contact":
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
              <Pressable onPress={() => router.push("/Main/History")}>
                <HistoryIcon />
              </Pressable>
            );
          },
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-10 bg-white mb-safe-offset-0">
          <View className="items-center mb-5 relative">
            <View className="p-4 bg-gray-50 shadow-lg rounded-lg">
              <QRCode
                value={getQrValue()}
                size={200}
                color="black"
                backgroundColor="#f9fafb"
                getRef={(c) => (qrRef.current = c)}
              />
              <TouchableOpacity
                onPress={handleDownload}
                className="bg-blue-600 p-3 rounded-full shadow-xl absolute -right-5 -bottom-5"
              >
                <ImageDown size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="w-full mt-4 border border-gray-300 rounded-xl overflow-hidden">
              {/* <Picker
                selectedValue={format}
                onValueChange={(value) => setFormat(value)}
              >
                <Picker.Item label="PNG" value="png" />
                <Picker.Item label="JPG" value="jpg" />
                <Picker.Item label="PDF" value="pdf" />
              </Picker> */}
            </View>

            <View className="w-full mt-8 rounded-2xl p-4">
              <View className="flex-row items-center mb-3">
                {React.createElement(
                  qrTypes.find((t) => t.label === qrType)?.icon || Type,
                  { size: 22, color: "#2563eb" }
                )}
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  {qrType} QR
                </Text>
              </View>

              {renderInputs()}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateQrScreen;
