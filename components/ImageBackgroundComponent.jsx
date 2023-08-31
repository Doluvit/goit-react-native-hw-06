import { ImageBackground, StyleSheet } from "react-native";

export const ImageBackgroundComponent = ({ children }) => {
  return (
    <ImageBackground
      source={require("../assets/images/background_img.png")}
      resizeMode="cover"
      style={styles.image}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
