import React, { FC, useContext, useState } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import { AuthContext } from "../../context/AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import DeliveryList from "../../components/DeliveryList";
import CreateDelivery from "../../components/CreateDelivery";
import DeliveryListPresenceFalse from "../../components/DeliveryListPresenceFalse";

const Drawer = createDrawerNavigator();

interface Props {}

const RCO: FC<Props> = () => {
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
        initialRouteName="DeliveryListPresenceFalse"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007bff",
          },
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
          name="DeliveryListPresenceFalse"
          options={{ title: "Livraisons non présentes" }}
        >
          {() => (
            <DeliveryListPresenceFalse
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
        label="Livraisons non présentes"
        onPress={() => navigation.navigate("DeliveryListPresenceFalse")}
      />
      <DrawerItem
        label="Livraisons"
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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

export default RCO;
