import React, { FC, useContext, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../context/AuthProvider";
import DeliveryList from "../../components/DeliveryList";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import DeliveryListVirementFalse from "../../components/DeliveryListVirementFalse";

const Drawer = createDrawerNavigator();

interface Props {}

const Comptable: FC<Props> = () => {
  const { profile, logout } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnecter", onPress: logout },
    ]);
  };

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="DeliveryListVirementFalse"
        screenOptions={{
          headerStyle: { backgroundColor: "#007bff" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          drawerActiveTintColor: "#007bff",
          drawerLabelStyle: { fontSize: 16 },
        }}
        drawerContent={(props) => (
          <CustomDrawerContent {...props} onLogout={handleLogout} />
        )}
      >
        <Drawer.Screen
          name="DeliveryListVirementFalse"
          options={{ title: "Virement non reçu" }}
        >
          {() => (
            <DeliveryListVirementFalse
              sellerSite={profile?.site}
              sellerRole={profile?.role}
              key={refreshKey}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="DeliveryList" options={{ title: "Livraisons" }}>
          {() => (
            <DeliveryList
              sellerSite={profile?.site}
              sellerRole={profile?.role}
              key={refreshKey}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const CustomDrawerContent: FC<
  DrawerContentComponentProps & { onLogout: () => void }
> = ({ onLogout, navigation, ...props }) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Virement non reçu"
        onPress={() => navigation.navigate("DeliveryListVirementFalse")}
      />
      <DrawerItem
        label="Livraisons"
        onPress={() => navigation.navigate("DeliveryList")}
      />
      <View style={styles.separator} />
      <DrawerItem
        label="Se Déconnecter"
        onPress={onLogout}
        labelStyle={styles.logoutLabel}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  logoutLabel: {
    color: "#ff4d4f",
    fontWeight: "bold",
  },
});

export default Comptable;
