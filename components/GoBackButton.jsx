import { TouchableOpacity } from "react-native";
import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { IconLeftArrow } from "../assets/icons/icons";

export const GoBackButton = () => {
  const navigator = useNavigation();
  const handleTurnBack = () => {
    navigator.goBack();
  };
  return (
    <TouchableOpacity onPress={handleTurnBack}>
      <IconLeftArrow style={{ marginLeft: 16 }} />
    </TouchableOpacity>
  );
};
