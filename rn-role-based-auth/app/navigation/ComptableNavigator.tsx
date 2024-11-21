import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Comptable from "../screen/user-app/Comptable";

const Stack = createNativeStackNavigator<AppNavigatorTypes>();

export type AppNavigatorTypes = {
  home: undefined;
  comptable: undefined;
};

const ComptableNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="comptable" component={Comptable} />
    </Stack.Navigator>
  );
};

export default ComptableNavigator;
