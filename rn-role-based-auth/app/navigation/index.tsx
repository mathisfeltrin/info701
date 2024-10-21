import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../context/AuthProvider";
import AdminNavigator from "./AdminNavigator";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const { loggedIn, profile, busy } = useContext(AuthContext);

  // we can return different navigators like <AuthNavigator /> <AdminNavigator /> or <AppNavigator/>

  const isAdmin = profile?.role === "admin";

  if (busy)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );

  if (!loggedIn) return <AuthNavigator />;

  if (isAdmin) return <AdminNavigator />;

  return <AppNavigator />;
};

export default Navigator;
