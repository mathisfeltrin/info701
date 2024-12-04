import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { deliveriesUrl } from "../url";

const SITES = [
  "Annecy",
  "Aix Les Bains",
  "Chambéry",
  "Belley",
  "Paris",
  "Montpellier",
  "Six-Fours",
  "Thônes",
  "Lyon",
  "Marseille",
  "Nancy",
  "Strasbourg",
  "Lille",
];

interface DeliveryFormProps {
  onSubmit?: () => void; // Callback optionnel après création
}

const CreateDelivery: React.FC<DeliveryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    reference: "",
    numeroId: "",
    couleur: "",
    sitePresence: SITES[0],
    siteDestination: SITES[0],
    presence: false,
    disponible: null,
    frais: null,
    config: null,
    arrivalDate: null,
    qualityControlDate: null,
    paid: false,
    virement: false,
    dateLivraison: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(deliveriesUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la livraison !");
      }

      const data = await response.json();
      console.log("Livraison créée :", data);
      Alert.alert("Succès", "Livraison créée avec succès !");
      setFormData({
        name: "",
        model: "",
        reference: "",
        numeroId: "",
        couleur: "",
        sitePresence: SITES[0],
        siteDestination: SITES[0],
        presence: false,
        disponible: null,
        frais: null,
        config: null,
        arrivalDate: null,
        qualityControlDate: null,
        paid: false,
        virement: false,
        dateLivraison: null,
      });
      if (onSubmit) onSubmit();
    } catch (err) {
      setError((err as Error).message);
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nom du client"
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Modèle"
          value={formData.model}
          onChangeText={(value) => handleInputChange("model", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Référence"
          value={formData.reference}
          onChangeText={(value) => handleInputChange("reference", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Numéro ID"
          value={formData.numeroId}
          onChangeText={(value) => handleInputChange("numeroId", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Couleur"
          value={formData.couleur}
          onChangeText={(value) => handleInputChange("couleur", value)}
        />
        <Text style={styles.label}>Site de Présence</Text>
        <Picker
          selectedValue={formData.sitePresence}
          style={styles.picker}
          onValueChange={(value) => handleInputChange("sitePresence", value)}
        >
          {SITES.map((site) => (
            <Picker.Item key={site} label={site} value={site} />
          ))}
        </Picker>
        <Text style={styles.label}>Site de Destination</Text>
        <Picker
          selectedValue={formData.siteDestination}
          style={styles.picker}
          onValueChange={(value) => handleInputChange("siteDestination", value)}
        >
          {SITES.map((site) => (
            <Picker.Item key={site} label={site} value={site} />
          ))}
        </Picker>

        {error && <Text style={styles.error}>{error}</Text>}

        {isLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Créer</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
});

export default CreateDelivery;
