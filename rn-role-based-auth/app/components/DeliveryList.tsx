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
  Modal,
  Button,
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

const DeliveryList: React.FC<DeliveryListProps> = ({
  sellerSite,
  sellerRole,
}) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await fetch(deliveriesUrl);
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

  const handleDeliveryClick = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedDelivery(null);
    setModalVisible(false);
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
              onPress={() => handleDeliveryClick(item)}
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

      {/* Modal for displaying delivery details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedDelivery && (
              <>
                <Text style={styles.modalTitle}>
                  Détails de la livraison : {selectedDelivery.name}
                </Text>
                <View style={styles.modalSeparator}></View>
                <Text style={styles.modalText}>
                  Modèle : {selectedDelivery.model}
                </Text>
                <Text style={styles.modalText}>
                  Référence : {selectedDelivery.reference}
                </Text>
                <Text style={styles.modalText}>
                  ID : {selectedDelivery.numeroId}
                </Text>
                <Text style={styles.modalText}>
                  Couleur : {selectedDelivery.couleur}
                </Text>
                <Text style={styles.modalText}>
                  Site Présent : {selectedDelivery.sitePresence || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  Site Destination : {selectedDelivery.siteDestination || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  Présence : {selectedDelivery.presence ? "Oui" : "Non"}
                </Text>
                <Text style={styles.modalText}>
                  Disponibilité :{" "}
                  {selectedDelivery.disponible
                    ? new Date(selectedDelivery.disponible).toLocaleDateString()
                    : "Non"}
                </Text>
                <Text style={styles.modalText}>
                  Frais : {selectedDelivery.frais ? "Oui" : "Non"}
                </Text>
                <Text style={styles.modalText}>
                  Configuration :{" "}
                  {selectedDelivery.config
                    ? selectedDelivery.config
                    : "Non renseignée"}
                </Text>
                <Text style={styles.modalText}>
                  Date d'arrivée :{" "}
                  {selectedDelivery.arrivalDate
                    ? new Date(
                        selectedDelivery.arrivalDate
                      ).toLocaleDateString()
                    : "Non renseignée"}
                </Text>
                <Text style={styles.modalText}>
                  Date de contrôle qualité :{" "}
                  {selectedDelivery.qualityControlDate
                    ? new Date(
                        selectedDelivery.qualityControlDate
                      ).toLocaleDateString()
                    : "Non renseigné"}
                </Text>
                <Text style={styles.modalText}>
                  Payé : {selectedDelivery.paid ? "Oui" : "Non"}
                </Text>
                <Text style={styles.modalText}>
                  Virement recu : {selectedDelivery.virement ? "Oui" : "Non"}
                </Text>
                <Text style={styles.modalText}>
                  Livraison :{" "}
                  {selectedDelivery.dateLivraison
                    ? new Date(
                        selectedDelivery.dateLivraison
                      ).toLocaleDateString()
                    : "Non livrée"}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007bff",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    lineHeight: 22,
  },
  modalSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DeliveryList;
