import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import {
  Globe,
  InfoIcon,
  Link,
  Phone,
  QrCode,
  Trash2,
  Wifi,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import QRCode from "react-native-qrcode-svg";

export type HistoryItem = {
  id: string;
  title: string;
  type: "Scanned" | "Created";
  time: string;
  icon: string;
};

const History = () => {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"All" | "Scanned" | "Created">("All");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const ACTION_WIDTH = 80;
  const loadHistory = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem("QuickScan_History");
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        setData([]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const deleteItem = async (id: string) => {
    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    await AsyncStorage.setItem("QuickScan_History", JSON.stringify(updated));
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      onPress={() => deleteItem(id)}
      className="bg-red-600 justify-center items-center rounded-2xl"
      style={{ width: ACTION_WIDTH }}
    >
      <Trash2 color="white" size={22} />
      <Text className="text-white text-xs mt-1">Delete</Text>
    </TouchableOpacity>
  );

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return <Globe size={24} color="#2563EB" />;
      case "Wifi":
        return <Wifi size={24} color="#059669" />;
      case "Link":
        return <Link size={24} color="#EA580C" />;
      case "Phone":
        return <Phone size={24} color="#7C3AED" />;
      default:
        return <QrCode size={24} color="#6B7280" />;
    }
  };

  const filteredData = useMemo(
    () =>
      filter === "All" ? data : data.filter((item) => item.type === filter),
    [data, filter]
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-500 mt-2">Loading history...</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white px-4">
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Saved Locally",
                    "Your QR scan history has been safely saved on this device. If you uninstall or clear app data, your saved history will be permanently removed.",
                    [{ text: "Got it", style: "default" }]
                  );
                }}
              >
                <InfoIcon />
              </Pressable>
            );
          },
        }}
      />

      <View className="flex-row justify-start items-center pb-4 ">
        {["All", "Scanned", "Created"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type as any)}
            className={`px-3 py-1 mx-2 rounded-full border ${
              filter === type
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                filter === type ? "text-white" : "text-gray-700"
              }`}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredData}
        contentContainerClassName="pt-2 pb-safe-offset-3"
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mb-2">
            <ReanimatedSwipeable
              overshootRight={false}
              rightThreshold={ACTION_WIDTH / 5}
              friction={2}
              renderRightActions={() => renderRightActions(item.id)}
            >
              <Pressable
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              >
                <View className="flex-row items-center  bg-gray-100 p-4 rounded-2xl shadow-sm">
                  <View className="mr-4">{renderIcon(item.icon)}</View>

                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      {item.title}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {item.time}
                    </Text>
                  </View>

                  <View
                    className={`px-3 py-1 rounded-full ${
                      item.type === "Scanned" ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        item.type === "Scanned"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.type}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </ReanimatedSwipeable>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center mt-10">
            <Text className="text-gray-500">No history yet</Text>
          </View>
        }
      />

      {modalVisible && (
        <Modal
          visible={modalVisible}
          transparent
          onRequestClose={() => setModalVisible(false)}
          statusBarTranslucent
        >
          <Pressable
            onPress={() => setModalVisible(false)}
            className="flex-1 bg-black/30 justify-end"
          >
            <Pressable onPress={() => {}}>
              <View className="w-full bg-white dark:bg-neutral-900 p-5 rounded-t-2xl">
                <ScrollView
                  contentContainerStyle={{
                    alignItems: "center",
                  }}
                  contentContainerClassName="pb-safe-offset-2"
                >
                  <QRCode
                    value={selectedItem?.title}
                    size={180}
                    color="#000"
                    backgroundColor="#f9fafb"
                  />

                  <View className="mt-5 w-full items-center">
                    <Text className="text-base font-semibold text-gray-800 dark:text-gray-200 text-center">
                      {selectedItem?.title}
                    </Text>

                    <View className="flex-row items-center mt-3">
                      <Ionicons
                        name={
                          selectedItem?.type === "Scanned"
                            ? "scan-outline"
                            : "create-outline"
                        }
                        size={18}
                        color="#2563eb"
                      />
                      <Text className="ml-2 text-blue-600 font-medium">
                        {selectedItem?.type}
                      </Text>
                    </View>

                    <View className="flex-row items-center mt-2">
                      <Ionicons name="time-outline" size={18} color="#6b7280" />
                      <Text className="ml-2 text-gray-600 dark:text-gray-400">
                        {selectedItem?.time}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="mt-4 bg-blue-600 rounded-xl py-3"
                >
                  <Text className="text-white text-center font-semibold text-base">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

export default History;
