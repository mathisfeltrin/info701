import React, { FC, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { AuthContext } from "../../context/AuthProvider";
import CreateDelivery from "../../components/CreateDelivery";
import DeliveryList from "../../components/DeliveryList";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

interface Props {}

const Vendeur: FC<Props> = () => {
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
        initialRouteName="DeliveryList"
        screenOptions={{
          headerStyle: { backgroundColor: "#007bff" },
          headerTintColor: "#fff",
          drawerActiveTintColor: "#007bff",
          drawerLabelStyle: { fontSize: 16 },
        }}
        drawerContent={(props) => (
          <CustomDrawerContent {...props} onLogout={handleLogout} />
        )}
      >
        <Drawer.Screen
          name="DeliveryList"
          options={{ title: "Liste des Livraisons" }}
        >
          {() => <DeliveryList sellerSite={profile?.site} key={refreshKey} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="CreateDelivery"
          options={{ title: "Créer une Livraison" }}
        >
          {() => (
            <CreateDelivery
              onSubmit={() => setRefreshKey((prevKey) => prevKey + 1)}
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
        label="Liste des Livraisons"
        onPress={() => navigation.navigate("DeliveryList")}
      />
      <DrawerItem
        label="Créer une Livraison"
        onPress={() => navigation.navigate("CreateDelivery")}
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

export default Vendeur;
