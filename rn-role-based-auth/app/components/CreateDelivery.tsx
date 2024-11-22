import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

interface DeliveryFormProps {
  onSubmit?: () => void; // Callback optionnel après création
}

const CreateDelivery: React.FC<DeliveryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    model: "",
    reference: "",
    numeroId: "",
    couleur: "",
    sitePresence: "",
    siteDestination: "",
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
      const response = await fetch("http://172.20.10.4:8000/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la livraison");
      }

      const data = await response.json();
      console.log("Livraison créée :", data);
      Alert.alert("Succès", "Livraison créée avec succès !");
      setFormData({
        model: "",
        reference: "",
        numeroId: "",
        couleur: "",
        sitePresence: "",
        siteDestination: "",
      });
      if (onSubmit) onSubmit();
    } catch (err) {
      setError((err as Error).message);
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }

    // // Simuler une soumission de formulaire
    // setTimeout(() => {
    //   setIsLoading(false);
    //   Alert.alert("Succès", "Livraison créée avec succès");
    //   if (onSubmit) {
    //     onSubmit();
    //   }
    // }, 2000);
  };

  return (
    <>
      <Text style={styles.title}>Créer une Livraison</Text>

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
      <TextInput
        style={styles.input}
        placeholder="Site de Présence"
        value={formData.sitePresence}
        onChangeText={(value) => handleInputChange("sitePresence", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Site de Destination"
        value={formData.siteDestination}
        onChangeText={(value) => handleInputChange("siteDestination", value)}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Créer</Text>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
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

export default CreateDelivery;
