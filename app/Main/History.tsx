import { Globe, Link, Phone, QrCode, Wifi } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const History = () => {
  const data = [
    {
      id: "1",
      title: "https://feed4me.in",
      type: "Scanned",
      time: "Nov 8, 2025 • 5:42 PM",
      icon: "Globe",
    },
    {
      id: "2",
      title: "WIFI:HomeNetwork123",
      type: "Created",
      time: "Nov 8, 2025 • 5:30 PM",
      icon: "Wifi",
    },
    {
      id: "3",
      title: "https://github.com/ayush",
      type: "Scanned",
      time: "Nov 8, 2025 • 4:00 PM",
      icon: "Link",
    },
    {
      id: "4",
      title: "Contact: +91 9876543210",
      type: "Created",
      time: "Nov 7, 2025 • 8:10 PM",
      icon: "Phone",
    },
    {
      id: "5",
      title: "mailto:support@quickscan.app",
      type: "Created",
      time: "Nov 7, 2025 • 7:55 PM",
      icon: "Mail",
    },
    {
      id: "6",
      title: "https://youtube.com/@quickscan",
      type: "Scanned",
      time: "Nov 7, 2025 • 7:10 PM",
      icon: "Globe",
    },
    {
      id: "7",
      title: "vCard: John Doe",
      type: "Created",
      time: "Nov 7, 2025 • 6:45 PM",
      icon: "QrCode",
    },
    {
      id: "8",
      title: "https://twitter.com/ayushb",
      type: "Scanned",
      time: "Nov 7, 2025 • 5:20 PM",
      icon: "Link",
    },
    {
      id: "9",
      title: "SMS:+919876543210?Hello there!",
      type: "Created",
      time: "Nov 6, 2025 • 9:00 PM",
      icon: "Phone",
    },
    {
      id: "10",
      title: "https://news.google.com",
      type: "Scanned",
      time: "Nov 6, 2025 • 8:30 PM",
      icon: "Globe",
    },
    {
      id: "11",
      title: "Text: Scan this to join event",
      type: "Created",
      time: "Nov 6, 2025 • 7:15 PM",
      icon: "QrCode",
    },
    {
      id: "12",
      title: "https://openai.com",
      type: "Scanned",
      time: "Nov 6, 2025 • 5:40 PM",
      icon: "Globe",
    },
    {
      id: "13",
      title: "Contact: Sarah +91 9988776655",
      type: "Created",
      time: "Nov 5, 2025 • 10:10 PM",
      icon: "Phone",
    },
    {
      id: "14",
      title: "https://instagram.com/feed4me",
      type: "Scanned",
      time: "Nov 5, 2025 • 8:50 PM",
      icon: "Link",
    },
    {
      id: "15",
      title: "WIFI:OfficeNet_5GHz",
      type: "Created",
      time: "Nov 5, 2025 • 7:25 PM",
      icon: "Wifi",
    },
  ];

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
  const [filter, setFilter] = useState<"All" | "Scanned" | "Created">("All");

  const filteredData =
    filter === "All" ? data : data.filter((item) => item.type === filter);

  return (
    <View className="flex-1 bg-white px-4 ">
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
          <View className="flex-row items-center  bg-gray-100 p-4 mb-3 rounded-2xl shadow-sm">
            <View className="mr-4">{renderIcon(item.icon)}</View>

            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {item.title}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">{item.time}</Text>
            </View>

            <View
              className={`px-3 py-1 rounded-full ${
                item.type === "Scanned" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  item.type === "Scanned" ? "text-blue-600" : "text-green-600"
                }`}
              >
                {item.type}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default History;
