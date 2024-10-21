import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../screen/admin/Dashboard";

const Stack = createNativeStackNavigator<AdminNavigatorTypes>();

export type AdminNavigatorTypes = {
  dashboard: undefined;
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
