import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { router } from "expo-router";

export default function Home() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const windowWidth = Dimensions.get("window").width;
  const cameraRef = useRef<CameraView | null>(null);

  const [photo, setPhoto] = useState<{ uri: string } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const setSnap = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      let photo: CameraCapturedPicture | undefined =
        await cameraRef.current.takePictureAsync(options);
      setPhoto(photo ? photo : null);
      setScanning(false);
      setUri(photo?.uri ?? null);
      router.push({
        pathname: "/info",
        params: { photo: photo?.uri },
      });

      // callGoogleVisionApi를 호출하려면 아래 주석을 해제하고 함수를 정의하세요
      // callGoogleVisionApi(photo.base64);
    }
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View>
            <Text
              style={{
                ...styles.info,
                width: windowWidth,
              }}
            >
              사진을 찍으시면 건물에 대한 정보가 나옵니다.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={setSnap}>
              <Text style={styles.text}></Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    textAlign: "center",
    backgroundColor: "black",
    color: "white",
    paddingVertical: 10,
    fontSize: 14,
    opacity: 0.5,
  },
  Camera: {
    flex: 1,
    // backgroundColor:"blue",
  },
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
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 30,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    fontWeight: "bold",
    color: "white",
  },
});
