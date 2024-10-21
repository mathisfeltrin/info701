import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import AdminNavigator from "./AdminNavigator";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const { loggedIn, profile } = useContext(AuthContext);

  // we can return different navigators like <AuthNavigator /> <AdminNavigator /> or <AppNavigator/>

  const isAdmin = profile?.role === "admin";

  if (!loggedIn) return <AuthNavigator />;

  if (isAdmin) return <AdminNavigator />;

  return <AppNavigator />;
};

export default Navigator;
