import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import {
  IconCamera,
  IconLocalPosition,
  IconTrashBucket,
} from "../assets/icons/icons";
import { addPost } from "../redux/userPostsSlice";
import { writeDataToFirestore } from "../helpers/postsControllers";
import { selectAuthState } from "../redux/selectors";

const CreatePostsScreen = () => {
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false);
  const [hasCameraStatus, setHasCameraStatus] = useState(null);
  const [hasMediaStatus, setHasMediaStatus] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [locationTitle, setLocationTitle] = useState("");
  const [location, setLocation] = useState(null);
  const userId = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasCameraStatus(cameraStatus.status === "granted");
      setHasMediaStatus(mediaStatus.status === "granted");
    })();
  }, []);

  const handleSubmit = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Немає доступу до локації");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setLocation(coords);

    const post = {
      photoTitle,
      locationTitle,
      photoUri,
      location,
      comment: 0,
      userId: userId,
    };

    writeDataToFirestore(post);
    dispatch(addPost(post));
    navigation.navigate("Home", { screen: "Posts" });
    setPhotoTitle("");
    setLocationTitle("");
    setPhotoUri(null);
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      setPhotoUri(uri);
      await MediaLibrary.createAssetAsync(uri);
    }
  };
  if (hasCameraStatus === null) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Text>Очікую підтверження...</Text>
      </View>
    );
  }
  if (hasCameraStatus === false) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Text>Немає доступу до камери</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <View
            style={[
              styles.postContainer,
              {
                paddingBottom: isOpenKeyboard ? 55 : 34,
                height: isOpenKeyboard ? 16 : 34,
              },
            ]}
          >
            <View style={styles.postPhotoContainer}>
              {!photoUri ? (
                <Camera
                  style={{
                    flex: 1,
                    width: "100%",
                    height: 240,
                    borderWidth: 1,
                    borderColor: "#E8E8E8",
                    borderRadius: 8,
                    backgroundColor: "#F6F6F6",
                    marginBottom: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  type={type}
                  ref={setCameraRef}
                >
                  <TouchableOpacity onPress={takePhoto}>
                    <View style={styles.cameraWrapper}>
                      <IconCamera />
                    </View>
                  </TouchableOpacity>
                </Camera>
              ) : (
                <Image
                  source={{ uri: photoUri }}
                  style={{ width: "100%", height: "100%", borderRadius: 8 }}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "#BDBDBD",
                marginBottom: 38,
              }}
            >
              Завантажте фото
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Назва..."
              onFocus={() => setIsOpenKeyboard(true)}
              onBlur={() => setIsOpenKeyboard(false)}
              value={photoTitle}
              onChangeText={setPhotoTitle}
            />
            <View style={styles.locationWrapper}>
              <IconLocalPosition />
              <TextInput
                style={{ height: 50 }}
                placeholder="Місцевість..."
                onFocus={() => setIsOpenKeyboard(true)}
                onBlur={() => setIsOpenKeyboard(false)}
                value={locationTitle}
                onChangeText={setLocationTitle}
              />
            </View>
            <TouchableOpacity
              style={styles.onPublickButton}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Regular",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Опублікувати
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity>
                <View style={styles.trashButton}>
                  <IconTrashBucket onPress={() => setPhotoUri(null)} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  postContainer: {
    flex: 1,
    width: "100%",
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
  },
  postPhotoContainer: {
    width: "100%",
    height: 240,
    borderRadius: 15,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cameraWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  input: {
    minWidth: "100%",
    height: 50,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderColor: "#E8E8E8",
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderBottomWidth: 2,
    borderColor: "#E8E8E8",
    height: 50,
    marginBottom: 32,
  },
  onPublickButton: {
    width: "100%",
    backgroundColor: "#FF6C00",
    paddingBottom: 16,
    paddingTop: 16,
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 120,
  },
  trashButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 40,
    backgroundColor: "#F6F6F6",
    paddingBottom: 8,
    paddingTop: 8,
    alignItems: "center",
    borderRadius: 100,
  },
});

export default CreatePostsScreen;
