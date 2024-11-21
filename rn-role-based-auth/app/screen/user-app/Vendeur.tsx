import React, { FC, useContext } from "react";
import { View, StyleSheet, Text, Button, FlatList } from "react-native";
import { AuthContext } from "../../context/AuthProvider";
import CreateDelivery from "../../components/CreateDelivery"; // Import du composant CreateDelivery
import DeliveryList from "../../components/DeliveryList"; // Import du composant DeliveryList

interface Props {}

const Vendeur: FC<Props> = () => {
  const { logout } = useContext(AuthContext);

  // Données statiques pour structurer la page
  const sections = [
    {
      key: "header",
      content: <Text style={styles.title}>Bienvenue dans la page vendeur</Text>,
    },
    {
      key: "logout",
      content: <Button onPress={logout} title="Logout" />,
    },
    {
      key: "create-delivery",
      content: (
        <View style={styles.deliveryContainer}>
          <Text style={styles.subtitle}>Créer une nouvelle livraison :</Text>
          <CreateDelivery
            onSubmit={() => {
              console.log("Livraison créée avec succès !");
            }}
          />
        </View>
      ),
    },
    {
      key: "delivery-list",
      content: (
        <View style={styles.deliveryListContainer}>
          <Text style={styles.subtitle}>Liste des livraisons :</Text>
          <DeliveryList />
        </View>
      ),
    },
  ];

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => (
        <View style={styles.section}>{item.content}</View>
      )}
      keyExtractor={(item) => item.key}
      ListFooterComponent={<View style={{ height: 20 }} />} // Ajoute un espace en bas
    />
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  deliveryContainer: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  deliveryListContainer: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default Vendeur;
