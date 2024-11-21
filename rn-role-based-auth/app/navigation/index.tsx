import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../context/AuthProvider";
import RCONavigator from "./RCONavigator";
import VendeurNavigator from "./VendeurNavigator";
import AuthNavigator from "./AuthNavigator";
import SecretaireNavigator from "./SecretaireNavigator";
import ChauffeurNavigator from "./ChauffeurNavigator";
import ExpertProduitNavigator from "./ExpertProduitNavigator";
import AccessoiristeNavigator from "./AccessoiristeNavigator";
import FMNavigator from "./FMNavigator";
import ComptableNavigator from "./ComptableNavigator";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const { loggedIn, profile, busy } = useContext(AuthContext);

  // we can return different navigators like <AuthNavigator /> <AdminNavigator /> or <AppNavigator/>

  const isRCO = profile?.role === "RCO";
  const isSecretaire = profile?.role === "secretaire";
  const isChauffeur = profile?.role === "chauffeur";
  const isExpertProduit = profile?.role === "expert_produit";
  const isAccessoiriste = profile?.role === "accessoiriste";
  const isFM = profile?.role === "FM";
  const isComptable = profile?.role === "comptable";

  if (busy)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );

  if (!loggedIn) return <AuthNavigator />;

  if (isRCO) return <RCONavigator />;

  if (isSecretaire) return <SecretaireNavigator />;

  if (isChauffeur) return <ChauffeurNavigator />;

  if (isExpertProduit) return <ExpertProduitNavigator />;

  if (isAccessoiriste) return <AccessoiristeNavigator />;

  if (isFM) return <FMNavigator />;

  if (isComptable) return <ComptableNavigator />;

  return <VendeurNavigator />;
};

export default Navigator;
