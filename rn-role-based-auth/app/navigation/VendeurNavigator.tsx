import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Vendeur from "../screen/user-app/Vendeur";

const Stack = createNativeStackNavigator<AppNavigatorTypes>();

export type AppNavigatorTypes = {
  home: undefined;
  vendeur: undefined;
};

const VendeurNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Vendeur} />
    </Stack.Navigator>
  );
};

export default VendeurNavigator;
