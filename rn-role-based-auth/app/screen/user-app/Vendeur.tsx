import React, { FC, useContext, useState } from "react";
import { View, StyleSheet, Text, Pressable, FlatList } from "react-native";
import { AuthContext } from "../../context/AuthProvider";
import CreateDelivery from "../../components/CreateDelivery"; // Import du composant CreateDelivery
import DeliveryList from "../../components/DeliveryList"; // Import du composant DeliveryList
import { useFocusEffect, NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

interface Props {}

const Vendeur: FC<Props> = () => {
  const { logout } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey((prevKey) => prevKey + 1); // Recharger l'écran
    }, [])
  );

  // Données statiques pour structurer la page
  const sections = [
    {
      key: "header",
      content: <Text style={styles.title}>Bienvenue dans la page vendeur</Text>,
    },
    {
      key: "create-delivery",
      content: (
        // <View style={styles.section}>
        <>
          {/* <Text style={styles.sectionTitle}>Créer une Livraison</Text> */}
          <CreateDelivery
            onSubmit={() => setRefreshKey((prevKey) => prevKey + 1)}
          />
        </>
        // </View>
      ),
    },
    {
      key: "delivery-list",
      content: (
        <>
          {/* <Text style={styles.sectionTitle}>Liste des Livraisons :</Text> */}
          <DeliveryList key={refreshKey} />
        </>
      ),
    },
    {
      key: "logout",
      content: (
        <Pressable style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Se Déconnecter</Text>
        </Pressable>
      ),
    },
  ];

  // return (
  //   <FlatList
  //     data={sections}
  //     renderItem={({ item }) => (
  //       <View style={styles.section}>{item.content}</View>
  //     )}
  //     keyExtractor={(item) => item.key}
  //     ListFooterComponent={<View style={{ height: 20 }} />} // Ajoute un espace en bas
  //   />
  // );

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
      >
        <Drawer.Screen
          name="DeliveryList"
          options={{ title: "Liste des Livraisons" }}
        >
          {() => <DeliveryList key={refreshKey} />}
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

const styles = StyleSheet.create({
  section: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Vendeur;
