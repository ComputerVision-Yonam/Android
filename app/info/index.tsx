import { Dimensions, Image, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";

interface InfoRoute {
  key: string;
  name: string;
  path?: string;
  params: {
    photo?: string;
  };
}

export default function Info() {
  const windowWidth = Dimensions.get("window").width;
  const route = useRoute<InfoRoute>();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <HeaderBackButton
          onPress={() => {
            console.log("살려줘");
            router.back();
          }}
        />
        <Text style={{ fontSize: 18 }}>사진 정보</Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "skyblue",
        }}
      >
        <Image
          source={{ uri: route.params?.photo }}
          style={{ height: "100%" }}
          alt={"img"}
        />
      </View>
      <View
        style={{
          flex: 1.5,
          marginTop: 15,
        }}
      >
        <Text style={{ fontSize: 30, alignSelf: "center" }}>
          연암공과대학교 - 산학협동관
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10, marginLeft: 20 }}>
          산학협동관은 어쩌구 저쩌구
        </Text>
      </View>
    </View>
  );
}
