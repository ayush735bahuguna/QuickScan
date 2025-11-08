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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <RefreshCcw color={"white"} />
        </TouchableOpacity>
        {facing === "back" && (
          <TouchableOpacity style={styles.button} onPress={toggleFlashlight}>
            {flashlightOn ? (
              <FlashlightOff color={"white"} />
            ) : (
              <Flashlight color={"white"} />
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/Main/History")}
        >
          <HistoryIcon color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/Main/(CreateQr)/SelectQrType")}
        >
          <ScanQrCodeIcon color={"white"} />
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
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
    justifyContent: "space-around",
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
