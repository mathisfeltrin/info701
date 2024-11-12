import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chauffeur from "../screen/user-app/Chauffeur";

const Stack = createNativeStackNavigator<AppNavigatorTypes>();

export type AppNavigatorTypes = {
  home: undefined;
  chauffeur: undefined;
};

const ChauffeurNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="chauffeur" component={Chauffeur} />
    </Stack.Navigator>
  );
};

export default ChauffeurNavigator;
