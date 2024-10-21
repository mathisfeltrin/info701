import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
} from "react-native";
import { AuthNavigatorTypes } from "../navigation/AuthNavigator";
import { signupUrl } from "../url";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AuthNavigatorTypes>>();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    // TODO: validate your userInfo

    const signUpRes = await fetch(signupUrl, {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const apiResJson = await signUpRes.json();
    console.log(apiResJson);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={userInfo.name}
        onChangeText={(name) => setUserInfo({ ...userInfo, name })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={userInfo.email}
        onChangeText={(email) => setUserInfo({ ...userInfo, email })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={userInfo.password}
        onChangeText={(password) => setUserInfo({ ...userInfo, password })}
        secureTextEntry
      />
      <Button title="Signup" onPress={handleSignUp} />

      <Pressable onPress={() => navigate("signin")}>
        <Text style={styles.link}>I already have acc signin</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
  },
  input: {
    padding: 5,
    borderWidth: 2,
    marginVertical: 20,
  },
  link: {
    color: "blue",
    fontSize: 20,
    paddingVertical: 10,
  },
});

export default SignUp;
