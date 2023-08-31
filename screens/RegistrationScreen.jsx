import { SvgXml } from "react-native-svg";
import { useState } from "react";
import {
  StatusBar,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ImageBackgroundComponent } from "../components/ImageBackgroundComponent";
import { iconSvg } from "../assets/icons/icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config";
import { useDispatch } from "react-redux";
import { logedIn, newUser } from "../redux/authSlice";

const RegistrationScreen = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isFocusedLogin, setIsFocusedLogin] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const togglePassword = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onLogin = (userId) => {
    dispatch(logedIn({ userId }));
    navigation.navigate("Home");
  };

  const onPressNavigate = () => {
    navigation.navigate("LoginScreen");
  };

  const updateUserProfile = async (user) => {
    if (user) {
      try {
        await updateProfile(user, { displayName: login });
        user.displayName = login;
      } catch (error) {
        console.log("Помилка при оновленні профілю:", error);
        throw error;
      }
    }
  };

  const registerDB = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateUserProfile(user);
        const updatedUser = { email, password, displayName: login };
        dispatch(newUser(updatedUser));
        onLogin(user.uid);
      })
      .catch((error) => {
        alert(`${error.message}`);
      });
    setEmail("");
    setLogin("");
    setPassword("");
  };

  const handleFocus = (input) => {
    switch (input) {
      case "login":
        setIsFocusedLogin(true);
        setIsOpenKeyboard(true);
        break;
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
      case "login":
        setIsFocusedLogin(false);
        setIsOpenKeyboard(false);
        break;
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container1}>
        <ImageBackgroundComponent>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View
                style={{
                  ...styles.formWrapper,
                  paddingBottom: isOpenKeyboard ? 10 : 111,
                  height: isOpenKeyboard ? 360 : "auto",
                }}
              >
                <View style={styles.form}>
                  <View style={styles.userPhoto}>
                    <TouchableOpacity style={styles.iconContainer}>
                      <SvgXml xml={iconSvg} width={25} height={25} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.title}>Реєcтрація</Text>

                  <TextInput
                    style={[
                      styles.input,
                      isFocusedLogin && styles.inputFocused,
                    ]}
                    value={login}
                    onChangeText={setLogin}
                    onFocus={() => handleFocus("login")}
                    onBlur={() => handleBlur("login")}
                    placeholder="Логін"
                  ></TextInput>
                  <TextInput
                    style={[
                      styles.input,
                      isFocusedEmail && styles.inputFocused,
                    ]}
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
                    ></TextInput>
                    <TouchableOpacity style={styles.showPasswordButton}>
                      <Text
                        style={styles.showPasswordButtonText}
                        onPress={togglePassword}
                      >
                        {secureTextEntry ? "Показати" : "Сховати"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Pressable style={styles.button} onPress={registerDB}>
                    <Text style={styles.buttonText}>Зареєструватися</Text>
                  </Pressable>
                  <View style={styles.moveLink}>
                    <Text style={styles.text}>Вже є акаунт? </Text>
                    <TouchableOpacity onPress={onPressNavigate}>
                      <Text style={styles.text}>Увійти</Text>
                    </TouchableOpacity>
                  </View>
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
  container1: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formWrapper: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "white",
    width: "100%",
    position: "absolute",
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
    marginTop: 92,
    marginBottom: 33,
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
  userPhoto: {
    position: "absolute",
    top: -60,
    left: "50%",
    transform: [{ translateX: -60 }],
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  iconContainer: {
    position: "absolute",
    bottom: 12.5,
    right: 0,
    transform: [{ translateX: 12.5 }],
  },
  moveLink: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegistrationScreen;
