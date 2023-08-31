import * as React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconLogout } from "../assets/icons/icons";

export const LogOutButton = () => {
  const navigator = useNavigation();
  const handleTurnBack = () => {
    navigator.navigate("RegistrationScreen");
  };
  return (
    <TouchableOpacity style={styles.button} onPress={handleTurnBack}>
      <IconLogout />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
});
