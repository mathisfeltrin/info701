import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExpertProduit from "../screen/user-app/ExpertProduit";

const Stack = createNativeStackNavigator<AppNavigatorTypes>();

export type AppNavigatorTypes = {
  home: undefined;
  expertProduit: undefined;
};

const ExpertProduitNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="expertProduit" component={ExpertProduit} />
    </Stack.Navigator>
  );
};

export default ExpertProduitNavigator;
