import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

interface Delivery {
  _id: string;
  model: string;
  reference: string;
  numeroId: string;
  couleur: string;
  sitePresence: string;
  siteDestination: string;
}

const DeliveryList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://172.20.10.4:8000/deliveries"); // Remplacez localhost si nécessaire
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des livraisons");
        }
        const data = await response.json();
        setDeliveries(data);
      } catch (err) {
        setError((err as Error).message);
        Alert.alert("Erreur", error || "Impossible de charger les livraisons");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.title}>Liste des Livraisons</Text>
      {deliveries.length === 0 ? (
        <Text style={styles.noDeliveries}>Aucune livraison trouvée.</Text>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            // <>
            <View style={styles.deliveryItem}>
              <View style={styles.deliveryHeader}>
                <Text style={styles.deliveryHeaderText}>
                  Modèle : {item.model}
                </Text>
              </View>
              <Text style={styles.deliveryText}>ID : {item.numeroId}</Text>
              <Text style={styles.deliveryText}>
                Référence : {item.reference}
              </Text>
              <Text style={styles.deliveryText}>Couleur : {item.couleur}</Text>
              <Text style={styles.deliveryText}>
                Site Présent : {item.sitePresence}
              </Text>
              <Text style={styles.deliveryText}>
                Site Destination : {item.siteDestination}
              </Text>
            </View>
            // </>
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  noDeliveries: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  deliveryItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5, // Pour un badge visuel
    borderLeftColor: "#007bff",
  },
  deliveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  deliveryHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#007bff",
  },
  deliveryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
});

export default DeliveryList;
