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
import * as ImageManipulator from "expo-image-manipulator"; // 📸 리사이즈용
import * as FileSystem from "expo-file-system";
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
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // 📤 서버로 이미지 업로드하는 함수
  const uploadToServer = async (uri: string) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const formData = new FormData();
    formData.append("image", {
      uri: fileInfo.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch("http://192.168.55.130:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("서버 응답:", data);
      if (data.predictions && data.predictions.length > 0) {
        const buildingClass = data.predictions[0].class;
        console.log("📍 예측된 건물:", buildingClass);
        return buildingClass;
      } else {
        console.log("건물 예측 결과가 없습니다.");
      }
      // TODO: 응답 결과를 상태로 저장하거나 페이지에 넘기기 등 추가 처리 가능
    } catch (error) {
      console.error("업로드 실패:", error);
    }
  };

  const setSnap = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      let photo: CameraCapturedPicture | undefined =
        await cameraRef.current.takePictureAsync(options);

      setPhoto(photo ?? null);
      setScanning(false);

      if (photo?.uri) {
        // 🧩 이미지 리사이징
        const resized = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 640, height: 640 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
        );

        setUri(resized.uri); // 리사이즈된 URI 저장

        // 📤 리사이즈된 이미지를 서버에 전송
        const predictName = await uploadToServer(resized.uri);

        // 📍 페이지 이동
        router.push({
          pathname: "/info",
          params: {
            photo: resized.uri,
            predictName: predictName ?? "정보 없음",
          },
        });
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
