import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FM from "../screen/user-app/FM";

const Stack = createNativeStackNavigator<AppNavigatorTypes>();

export type AppNavigatorTypes = {
  home: undefined;
  fm: undefined;
};

const FMNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="fm" component={FM} />
    </Stack.Navigator>
  );
};

export default FMNavigator;
