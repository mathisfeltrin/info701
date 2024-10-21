import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screen/user-app/Home";

const Stack = createNativeStackNavigator<AppNavigatorTypes>();

export type AppNavigatorTypes = {
  home: undefined;
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
