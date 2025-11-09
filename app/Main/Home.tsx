import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import {
  Flashlight,
  FlashlightOff,
  HistoryIcon,
  LucideCamera,
  RefreshCcw,
  ScanQrCodeIcon,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HistoryItem } from "./History";

export default function Home() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const CameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <View className="items-center mb-6">
          <LucideCamera size={80} color="#4B5563" />
          <Text className="text-2xl font-semibold text-gray-800 mt-4">
            Camera Access Needed
          </Text>
          <Text className="text-center text-gray-600 mt-2 px-6">
            To scan QR codes, please allow camera access. You can always change
            this later in settings.
          </Text>
        </View>

        <TouchableOpacity
          className={`w-3/4 py-3 rounded-2xl ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
          disabled={loading}
          onPress={async () => {
            setLoading(true);
            await requestPermission();
            setLoading(false);
          }}
        >
          <Text className="text-center text-white text-lg font-semibold">
            {loading ? "Requesting..." : "Grant Permission"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function savehistory(data: string) {
    let icon = "Scan";
    if (data.startsWith("http")) icon = "Globe";
    else if (data.startsWith("WIFI")) icon = "Wifi";
    else if (data.startsWith("tel:")) icon = "Phone";
    else if (data.startsWith("mailto:")) icon = "Mail";
    else if (data.startsWith("SMSTO")) icon = "MessageSquare";
    else if (data.includes("BEGIN:VCARD")) icon = "User";
    else icon = "QrCode";

    const time = dayjs().format("MMM D, YYYY • h:mm A");

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title: data,
      type: "Scanned",
      time,
      icon,
    };

    try {
      const existing = await AsyncStorage.getItem("QuickScan_History");
      const history = existing ? JSON.parse(existing) : [];

      const updatedHistory = [newItem, ...history];

      await AsyncStorage.setItem(
        "QuickScan_History",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Error saving scan:", error);
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
    setFlashlightOn(false);
    setScanned(false);
  }

  function toggleFlashlight() {
    setFlashlightOn((prev) => !prev);
  }

  const detectQrType = (data: string): { type: string; icon: string } => {
    if (/^https?:\/\//i.test(data)) return { type: "Link", icon: "Globe" };
    if (/^WIFI:/i.test(data)) return { type: "WiFi", icon: "Wifi" };
    if (/^mailto:/i.test(data)) return { type: "Email", icon: "Mail" };
    if (/^SMSTO:/i.test(data) || /^SMS:/i.test(data))
      return { type: "SMS", icon: "MessageCircle" };
    if (/^tel:/i.test(data) || /^\+?\d{10,}$/i.test(data))
      return { type: "Phone", icon: "Phone" };
    if (/^BEGIN:VCARD/i.test(data)) return { type: "Contact", icon: "QrCode" };
    return { type: "Text", icon: "QrCode" };
  };

  async function handleBarCodeScanned({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) {
    if (scanned) return;

    setScanned(true);
    CameraRef.current?.pausePreview();

    Alert.alert("Scanned Successfully!", data, [
      {
        text: "Cancel",
        onPress: async () => {
          setScanned(false);
          CameraRef.current?.resumePreview();
          await savehistory(data);
        },
      },
      {
        text: "Open",
        onPress: async () => {
          setScanned(false);
          CameraRef.current?.resumePreview();
          const { type: qrType } = detectQrType(data);

          switch (qrType) {
            case "Link":
              await Linking.openURL(data);
              break;
            case "Phone":
              await Linking.openURL(
                data.startsWith("tel:") ? data : `tel:${data}`
              );
              break;
            case "Email":
              await Linking.openURL(data);
              break;
            case "SMS":
              await Linking.openURL(data);
              break;
            case "WiFi":
              Alert.alert(
                "WiFi QR",
                "Detected WiFi QR Code. Connect manually."
              );
              break;
            case "Contact":
              Alert.alert("vCard Detected", "Import contact manually.");
              break;
            default:
              Alert.alert("QR Content", data);
              break;
          }

          await savehistory(data);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={CameraRef}
        onBarcodeScanned={handleBarCodeScanned}
        facing={facing}
        enableTorch={flashlightOn ? true : false}
        style={styles.camera}
        mode="picture"
        zoom={0}
      />

      <View className="absolute bottom-0 w-full flex flex-col  justify-center items-center gap-5">
        <View className="flex flex-row gap-5">
          <TouchableOpacity
            className="flex items-center justify-center bg-slate-700 p-3 rounded-full"
            onPress={toggleCameraFacing}
          >
            <RefreshCcw color={"white"} />
          </TouchableOpacity>
          {facing === "back" && (
            <TouchableOpacity
              className="flex items-center justify-center bg-slate-700 p-3 rounded-full"
              onPress={toggleFlashlight}
            >
              {flashlightOn ? (
                <FlashlightOff color={"white"} />
              ) : (
                <Flashlight color={"white"} />
              )}
            </TouchableOpacity>
          )}
        </View>
        <View className="bg-black/80 w-full">
          <Text className="text-white text-center px-5 pb-safe-offset-2 pt-2">
            Align the QR code within the frame to scan it automatically
          </Text>
        </View>
      </View>
      <View className="absolute top-safe-offset-1 right-0 flex flex-row justify-center items-center gap-3 p-5">
        <TouchableOpacity
          className="flex items-center justify-center bg-slate-700 p-3 rounded-full"
          onPress={() => router.push("/Main/(CreateQr)/SelectQrType")}
        >
          <ScanQrCodeIcon color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex items-center justify-center bg-slate-700 p-3 rounded-full"
          onPress={() => router.push("/Main/History")}
        >
          <HistoryIcon color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },

  button: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
