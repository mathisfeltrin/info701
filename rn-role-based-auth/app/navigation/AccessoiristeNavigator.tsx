import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Accessoiriste from "../screen/user-app/Accessoiriste";

const Stack = createNativeStackNavigator<AppNavigatorTypes>();

export type AppNavigatorTypes = {
  home: undefined;
  accessoiriste: undefined;
};

const AccessoiristeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="accessoiriste" component={Accessoiriste} />
    </Stack.Navigator>
  );
};

export default AccessoiristeNavigator;
