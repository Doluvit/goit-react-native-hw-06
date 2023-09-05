import { useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { ImageBackgroundComponent } from "../components/ImageBackgroundComponent";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config";
import { logedIn } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      if (user) {
        navigation.navigate("Home");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const togglePassword = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const loginDB = async () => {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = credentials.user.uid;

      dispatch(logedIn({ email, password, userId }));
      onLogin();
      return credentials.user;
    } catch (error) {
      alert(
        "Користувача з таким email не знайдено, перейдіть на сторінку реєстрації."
      );
      throw error;
    }
  };

  const handleFocus = (input) => {
    switch (input) {
      case "email":
        setIsFocusedEmail(true);
        setIsOpenKeyboard(true);
        break;
      case "password":
        setIsFocusedPassword(true);
        setIsOpenKeyboard(true);
        break;
      default:
        break;
    }
  };

  const handleBlur = (input) => {
    switch (input) {
      case "email":
        setIsFocusedEmail(false);
        setIsOpenKeyboard(false);
        break;
      case "password":
        setIsFocusedPassword(false);
        setIsOpenKeyboard(false);
        break;
      default:
        break;
    }
  };

  const onLogin = () => {
    setEmail("");
    setPassword("");
    navigation.navigate("Home");
  };

  const onPressNavigate = () => {
    navigation.navigate("RegistrationScreen");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontFamily: "Roboto-Medium", fontSize: 22 }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackgroundComponent>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View
                style={{
                  ...styles.formWrapper,
                  paddingBottom: isOpenKeyboard ? 10 : 144,
                  height: isOpenKeyboard ? 250 : "auto",
                }}
              >
                <Text style={styles.title}>Увійти</Text>
                <TextInput
                  style={[styles.input, isFocusedEmail && styles.inputFocused]}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  placeholder="Адреса електронної пошти"
                ></TextInput>
                <View
                  style={[
                    styles.passwordInputContainer,
                    isFocusedPassword && styles.inputFocused,
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureTextEntry}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password")}
                    placeholder="Пароль"
                  />
                  <TouchableOpacity
                    style={styles.showPasswordButton}
                    onPress={togglePassword}
                  >
                    <Text style={styles.showPasswordButtonText}>
                      {secureTextEntry ? "Показати" : "Сховати"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Pressable style={styles.button} onPress={loginDB}>
                  <Text style={styles.buttonText}>Увійти</Text>
                </Pressable>
                <View style={styles.moveLink}>
                  <Text style={styles.text}> Немає акаунту? </Text>
                  <TouchableOpacity onPress={onPressNavigate}>
                    <Text style={styles.text}>Зареєструватись</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackgroundComponent>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  formWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  form: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 32,
    fontSize: 30,
    fontWeight: 600,
    color: "#212121",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  input: {
    height: 50,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,

    borderWidth: 2,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#F6F6F6",
  },
  inputFocused: {
    borderColor: "orange",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderWidth: 2,
    marginLeft: 16,
    marginRight: 16,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#F6F6F6",
  },
  passwordInput: {
    height: 50,
    flex: 1,
    borderWidth: 0,
  },
  showPasswordButton: {
    marginLeft: 10,
  },
  showPasswordButtonText: {
    color: "#1B4371",
    fontSize: 16,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#1B4371",
    textAlign: "center",
  },
  button: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 43,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 100,
    elevation: 3,
    backgroundColor: "#FF6C00",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  moveLink: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
