import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../screen/SignIn";
import SignUp from "../screen/SignUp";

const Stack = createNativeStackNavigator<AuthNavigatorTypes>();

export type AuthNavigatorTypes = {
  signin: undefined;
  signup: undefined;
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="signin" component={SignIn} />
      <Stack.Screen name="signup" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
