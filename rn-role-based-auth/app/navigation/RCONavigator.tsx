import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RCO from "../screen/user-app/RCO";

const Stack = createNativeStackNavigator<AdminNavigatorTypes>();

export type AdminNavigatorTypes = {
  dashboard: undefined;
  rco: undefined;
};

const RCONavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="rco" component={RCO} />
    </Stack.Navigator>
  );
};

export default RCONavigator;
