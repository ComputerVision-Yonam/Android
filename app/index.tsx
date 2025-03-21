import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@/app/Home";
import Info from "@/app/info";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Info" component={Info} />
    </Stack.Navigator>
  );
}
