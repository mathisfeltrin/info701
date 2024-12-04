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
  Button,
  Modal,
} from "react-native";
import { deliveriesUrl } from "../url";

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
  config: string | null;
  arrivalDate: Date | null;
  qualityControlDate: Date | null;
  paid: boolean;
  virement: boolean;
  dateLivraison: Date | null;
}

interface DeliveryListProps {
  sellerSite: string | undefined;
  sellerRole: string | undefined;
}

const DeliveryListPresenceFalse: React.FC<DeliveryListProps> = ({
  sellerSite,
  sellerRole,
}) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );

  const [selectedConfig, setSelectedConfig] = useState<string>("");

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await fetch(deliveriesUrl);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des livraisons");
      }
      const data = await response.json();

      // ? log sellerSite
      console.log("sellerSite : ", sellerSite);

      // affichage de toutes les livraisons
      // setDeliveries(data);

      // affichage des livraisons avec une presence false
      setDeliveries(data.filter((delivery: Delivery) => !delivery.config));

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
      const response = await fetch(`${deliveriesUrl}/${id}/presence`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ presence }),
      });

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

  const handleSetDeliveryStatus = (id: string) => {
    Alert.alert("Présence", "L'article est-il disponible ?", [
      { text: "Non", onPress: () => updateDeliveryPresence(id, false) },
      { text: "Oui", onPress: () => updateDeliveryPresence(id, true) },
    ]);
  };

  const updateDeliveryConfig = async (id: string, config: string) => {
    if (!config) {
      Alert.alert("Erreur", "Veuillez sélectionner une configuration.");
      return;
    }

    try {
      const response = await fetch(`${deliveriesUrl}/${id}/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la configuration");
      }

      const updatedDelivery = await response.json();

      // Mettre à jour l'état local
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery._id === id ? { ...delivery, config } : delivery
        )
      );

      Alert.alert("Succès", "Configuration mise à jour !");
      closeModal(); // Fermer la popup après la mise à jour
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de mettre à jour la configuration.");
    }
  };

  const openModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery); // Stocke la livraison sélectionnée
    setIsModalVisible(true); // Affiche la popup
  };

  const closeModal = () => {
    setSelectedDelivery(null); // Réinitialise la livraison sélectionnée
    setIsModalVisible(false); // Masque la popup
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
                openModal(item);
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
              <Text style={styles.deliveryText}>
                Configuration : {item.config}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configurer la Livraison</Text>
            {selectedDelivery && (
              <>
                <Text style={styles.modalText}>
                  Livraison pour : {selectedDelivery.name}
                </Text>
                <Text style={styles.modalText}>
                  Modèle : {selectedDelivery.model}
                </Text>
                <Text style={styles.modalText}>
                  Configuration actuelle :{" "}
                  {selectedDelivery.config || "Non définie"}
                </Text>

                {/* Options de configuration */}
                <Text style={styles.modalSubtitle}>
                  Choisissez une configuration :
                </Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedConfig === "Mode Sport" && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedConfig("Mode Sport")}
                  >
                    <Text style={styles.optionText}>Mode Sport</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedConfig === "Toit-Ouvrant" &&
                        styles.optionSelected,
                    ]}
                    onPress={() => setSelectedConfig("Toit-Ouvrant")}
                  >
                    <Text style={styles.optionText}>Toit-Ouvrant</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedConfig === "5 Portes" && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedConfig("5 Portes")}
                  >
                    <Text style={styles.optionText}>5 Portes</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.selectedConfigText}>
                  Config sélectionnée : {selectedConfig || "Aucune"}
                </Text>

                {/* Bouton pour soumettre */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() =>
                    updateDeliveryConfig(selectedDelivery._id, selectedConfig)
                  }
                >
                  <Text style={styles.submitButtonText}>Confirmer</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  optionsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginVertical: 15,
    gap: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  selectedConfigText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default DeliveryListPresenceFalse;
