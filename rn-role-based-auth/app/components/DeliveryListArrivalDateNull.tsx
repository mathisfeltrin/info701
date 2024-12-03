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
  Platform,
} from "react-native";
import { deliveriesUrl } from "../url";
import DateTimePicker from "@react-native-community/datetimepicker";

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

const DeliveryListArrivalDateNull: React.FC<DeliveryListProps> = ({
  sellerSite,
  sellerRole,
}) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [tempDate, setTempDate] = useState<Date | null>(null);

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
      // setDeliveries(data.filter((delivery: Delivery) => !delivery.presence));

      // affichage des livraisons non disponibles
      setDeliveries(
        data.filter((delivery: Delivery) => delivery.arrivalDate === null)
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

  const updateDeliveryDisponibility = async (
    id: string,
    disponible: Date | null
  ) => {
    try {
      const response = await fetch(`${deliveriesUrl}/${id}/disponibility`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disponible }),
      });

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

  const updateArrivalDate = async (id: string, arrivalDate: Date | null) => {
    if (!arrivalDate) {
      Alert.alert("Erreur", "Veuillez sélectionner une date valide.");
      return;
    }

    try {
      const response = await fetch(`${deliveriesUrl}/${id}/arrivalDate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ arrivalDate }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la date d'arrivée");
      }

      const updatedDelivery = await response.json();

      // Mettre à jour l'état local
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery._id === id ? { ...delivery, arrivalDate } : delivery
        )
      );

      console.log("Livraison mise à jour :", updatedDelivery);
      Alert.alert("Succès", "Date d'arrivée mise à jour !");
      closeModal();
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de mettre à jour la date d'arrivée.");
    }
  };

  const openModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery); // Stocke la livraison sélectionnée
    setIsDatePickerVisible(true); // Affiche la popup
  };

  const closeModal = () => {
    setSelectedDelivery(null); // Réinitialise la livraison sélectionnée
    setIsDatePickerVisible(false); // Masque la popup
  };

  const showDatePicker = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsDatePickerVisible(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setIsDatePickerVisible(false); // Cacher le picker sur Android après la sélection
    }

    if (date) {
      setTempDate(date); // Met à jour uniquement la date temporaire
    }
  };

  const confirmDate = () => {
    if (tempDate && selectedDelivery) {
      updateArrivalDate(selectedDelivery._id, tempDate); // Met à jour la date dans l'API
      setTempDate(null); // Réinitialise la date temporaire
      setSelectedDelivery(null); // Réinitialise la livraison sélectionnée
      setIsDatePickerVisible(false); // Ferme le picker
    } else {
      Alert.alert("Erreur", "Aucune date sélectionnée.");
    }
  };

  return (
    <>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deliveryItem}
            onPress={() => showDatePicker(item)}
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
              Date d'arrivée :{" "}
              {item.arrivalDate
                ? new Date(item.arrivalDate).toLocaleDateString()
                : "Non définie"}
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

      {/* DateTimePicker */}
      {isDatePickerVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Sélectionner une Date d'Arrivée
            </Text>
            <DateTimePicker
              value={tempDate || new Date()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              textColor="#333"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setTempDate(null);
                  setIsDatePickerVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDate}
              >
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,

  //   padding: 20,
  //   backgroundColor: "#f5f5f5",
  // },
  // title: {
  //   fontSize: 22,
  //   fontWeight: "bold",
  //   marginBottom: 20,
  //   textAlign: "center",
  // },
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
  // noDeliveries: {
  //   textAlign: "center",
  //   fontSize: 16,
  //   color: "#555",
  // },
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
    zIndex: 10,
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeliveryListArrivalDateNull;
