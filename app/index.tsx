import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.Camera}>
        <Text>카메라들어갈 자리</Text>
      </View>

  <View style={styles.infoView}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
  </View>
    </View>
  );
}

const styles={
  Camera:{
    flex:1,
    backgroundColor:"blue",
  },
  infoView:{
    flex:1,
    
  }

}
