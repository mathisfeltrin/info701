import { FC } from "react";
import { View, StyleSheet, Text, Button } from "react-native";

interface Props {}

const Home: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 25 }}>
        Welcome to Normal user App
      </Text>

      <Button title="Logout" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
