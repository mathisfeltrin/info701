import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

interface Delivery {
  _id: string;
  name: string;
  model: string;
  reference: string;
  numeroId: string;
  couleur: string;
  sitePresence: string;
  siteDestination: string;
  presence: boolean;
  disponible: Date | null;
  frais: boolean | null;
}

interface DeliveryListProps {
  sellerSite: string | undefined;
  sellerRole: string | undefined;
}

const DeliveryListDisponibleNull: React.FC<DeliveryListProps> = ({
  sellerSite,
  sellerRole,
}) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://172.20.10.4:8000/deliveries");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des livraisons");
      }
      const data = await response.json();

      // ? log sellerSite
      console.log("sellerSite : ", sellerSite);

      // affichage de toutes les livraisons
      // setDeliveries(data);

      // affichage des livraisons avec une presence false
      // setDeliveries(data.filter((delivery: Delivery) => !delivery.presence));

      // affichage des livraisons non disponibles
      setDeliveries(
        data.filter((delivery: Delivery) => delivery.disponible === null)
      );

      // if (sellerRole === "RCO") {
      //   setDeliveries(data.filter((delivery: Delivery) => !delivery.presence));
      // } else {
      //   setDeliveries(
      //     data.filter(
      //       (delivery: Delivery) => delivery.sitePresence === sellerSite
      //     )
      //   );
      // }
    } catch (err) {
      setError((err as Error).message);
      Alert.alert("Erreur", error || "Impossible de charger les livraisons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [sellerSite]);

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

  const updateDeliveryPresence = async (id: string, presence: boolean) => {
    try {
      const response = await fetch(
        `http://172.20.10.4:8000/deliveries/${id}/presence`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ presence }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la présence");
      }

      const updatedDelivery = await response.json();

      // Mettre à jour l'état local
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery._id === id ? { ...delivery, presence } : delivery
        )
      );

      console.log("Livraison mise à jour :", updatedDelivery);
    } catch (error) {
      console.error(error);
    }
  };

  const updateDeliveryDisponibility = async (
    id: string,
    disponible: Date | null
  ) => {
    try {
      const response = await fetch(
        `http://172.20.10.4:8000/deliveries/${id}/disponibility`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ disponible }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la présence");
      }

      const updatedDelivery = await response.json();

      // Mettre à jour l'état local
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery._id === id ? { ...delivery, disponible } : delivery
        )
      );

      console.log("Livraison mise à jour :", updatedDelivery);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetDeliveryStatus = (id: string) => {
    Alert.alert("Présence", "L'article est-il présent ?", [
      { text: "Non", onPress: () => updateDeliveryPresence(id, false) },
      { text: "Oui", onPress: () => updateDeliveryPresence(id, true) },
    ]);
  };

  const handleSetDeliveryDisponibility = (id: string) => {
    Alert.alert("Disponibilité", "L'article est-il disponible aujourd'hui ?", [
      { text: "Non", onPress: () => updateDeliveryDisponibility(id, null) },
      {
        text: "Oui",
        onPress: () => updateDeliveryDisponibility(id, new Date()),
      },
    ]);
  };

  return (
    <>
      {deliveries.length === 0 ? (
        <Text style={styles.noDeliveries}>Aucune livraison trouvée.</Text>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.deliveryItem}
              onPress={() => {
                if (sellerRole === "RCO") {
                  handleSetDeliveryDisponibility(item._id);
                }
              }}
            >
              <View style={styles.deliveryHeader}>
                <Text style={styles.deliveryHeaderText}>
                  Client : {item.name}
                </Text>
              </View>
              <Text style={styles.deliveryText}>Modèle : {item.model}</Text>
              <Text style={styles.deliveryText}>
                Référence : {item.reference}
              </Text>
              <Text style={styles.deliveryText}>ID : {item.numeroId}</Text>
              <Text style={styles.deliveryText}>Couleur : {item.couleur}</Text>
              <Text style={styles.deliveryText}>
                Site Présent : {item.sitePresence}
              </Text>
              <Text style={styles.deliveryText}>
                Site Destination : {item.siteDestination}
              </Text>
              <Text style={styles.deliveryText}>
                Présence : {item.presence ? "Oui" : "Non"}
              </Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchDeliveries}
              colors={["#007bff"]}
            />
          }
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
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
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

export default DeliveryListDisponibleNull;
