// import { NavigationProp, useNavigation } from "@react-navigation/native";
// import { FC, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   TextInput,
//   Button,
//   Pressable,
//   Text,
// } from "react-native";
// import { AuthNavigatorTypes } from "../navigation/AuthNavigator";
// import { signupUrl } from "../url";

// interface Props {}

// const SignUp: FC<Props> = (props) => {
//   const { navigate } = useNavigation<NavigationProp<AuthNavigatorTypes>>();
//   const [userInfo, setUserInfo] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const handleSignUp = async () => {
//     // TODO: validate your userInfo

//     const signUpRes = await fetch(signupUrl, {
//       method: "POST",
//       body: JSON.stringify(userInfo),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const apiResJson = await signUpRes.json();
//     console.log(apiResJson);
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your name"
//         value={userInfo.name}
//         onChangeText={(name) => setUserInfo({ ...userInfo, name })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         value={userInfo.email}
//         onChangeText={(email) => setUserInfo({ ...userInfo, email })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your password"
//         value={userInfo.password}
//         onChangeText={(password) => setUserInfo({ ...userInfo, password })}
//         secureTextEntry
//       />
//       <Button title="Signup" onPress={handleSignUp} />

//       <Pressable onPress={() => navigate("signin")}>
//         <Text style={styles.link}>I already have acc signin</Text>
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 80,
//   },
//   input: {
//     padding: 5,
//     borderWidth: 2,
//     marginVertical: 20,
//   },
//   link: {
//     color: "blue",
//     fontSize: 20,
//     paddingVertical: 10,
//   },
// });

// export default SignUp;
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { AuthNavigatorTypes } from "../navigation/AuthNavigator";
import { signupUrl } from "../url";

interface Props {}

const SignUp: FC<Props> = () => {
  const { navigate } = useNavigation<NavigationProp<AuthNavigatorTypes>>();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    try {
      if (!userInfo.name || !userInfo.email || !userInfo.password) {
        throw new Error("Tous les champs sont requis.");
      }

      const signUpRes = await fetch(signupUrl, {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const contentType = signUpRes.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const apiResJson = await signUpRes.json();
        console.log("Inscription réussie :", apiResJson);
        Alert.alert("Succès", "Compte créé avec succès !");
      } else {
        throw new Error("Erreur lors de l'inscription.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erreur:", error.message);
        Alert.alert("Erreur", error.message);
      } else {
        console.error("Erreur inconnue:", error);
        Alert.alert("Erreur", "Une erreur inattendue s'est produite.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={userInfo.name}
        onChangeText={(name) => setUserInfo({ ...userInfo, name })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userInfo.email}
        onChangeText={(email) => setUserInfo({ ...userInfo, email })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={userInfo.password}
        onChangeText={(password) => setUserInfo({ ...userInfo, password })}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate("signin")}>
        <Text style={styles.link}>J'ai déjà un compte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
  link: {
    color: "#007bff",
    fontSize: 16,
    marginTop: 20,
  },
});

export default SignUp;
