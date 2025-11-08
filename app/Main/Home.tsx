import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import {
  Flashlight,
  FlashlightOff,
  HistoryIcon,
  RefreshCcw,
  ScanQrCodeIcon,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function Home() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const CameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
    setFlashlightOn(false);
    setScanned(false);
  }

  function toggleFlashlight() {
    setFlashlightOn((prev) => !prev);
  }

  function handleBarCodeScanned({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) {
    if (!scanned) {
      setScanned(true);
      CameraRef.current?.pausePreview();
      Alert.alert("Scanned Data", `Type: ${type}\nData: ${data}`, [
        {
          text: "CANCEL",
          onPress: () => {
            setScanned(false);
            CameraRef.current?.resumePreview();
          },
        },
        {
          text: "OK",
          onPress: () => {
            CameraRef.current?.resumePreview();
            setScanned(false);
            Linking.openSettings();
          },
        },
      ]);
    }
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
