import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Secretaire from "../screen/user-app/Secr";

const Stack = createNativeStackNavigator<AppNavigatorTypes>();

export type AppNavigatorTypes = {
  home: undefined;
  secretaire: undefined;
};

const SecretaireNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="secretaire" component={Secretaire} />
    </Stack.Navigator>
  );
};

export default SecretaireNavigator;
