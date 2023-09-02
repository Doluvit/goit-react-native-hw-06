import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../config";
import { logedOut } from "../redux/authSlice";
import { TouchableOpacity, StyleSheet } from "react-native";
import { IconLogout } from "../assets/icons/icons";

export const LogOutButton = () => {
  const navigator = useNavigation();
   const dispatch = useDispatch();
  const handleTurnBack = () => {
    auth.signOut().then(() => {
      dispatch(logedOut());
      navigator.navigate("RegistrationScreen");
    }).catch((error) => {
      alert(error.message);
    })
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
