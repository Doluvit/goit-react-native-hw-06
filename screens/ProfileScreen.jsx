import { Image, Text, View, StyleSheet } from "react-native";
import { ImageBackgroundComponent } from "../components/ImageBackgroundComponent";
import { TouchableOpacity } from "react-native-gesture-handler";
import Post from "../components/Post";
import { LogOutButton } from "../components/LogOutButton";
import { IconClose } from "../assets/icons/icons";
import { FlatList } from "react-native";
import { auth, db } from "../config";
import { useState } from "react";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { selectAuthState } from "../redux/selectors";
import { useSelector } from "react-redux";

const ProfileScreen = () => {
  const userName = auth.currentUser?.displayName;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPosts, setCurrentPosts] = useState([]);
  const userId = useSelector(selectAuthState);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const newPost = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
       const userPosts = newPost.filter((post) => post.userId === userId);
      setCurrentPosts(userPosts);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackgroundComponent>
      <View style={styles.profileScreenContainer}>
        <View style={{ position: "absolute", top: 22, right: 0 }}>
          <LogOutButton />
        </View>
        <View style={styles.userPhoto}>
          <Image
            style={{ borderRadius: 16 }}
            source={require("../assets/images/user.jpg")}
          />
          <TouchableOpacity style={styles.closeButtonWrapper}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 25,
                height: 25,
                borderRadius: 50,
                backgroundColor: "#fff",
                borderColor: "#BDBDBD",
                borderWidth: 1,
              }}
            >
              <IconClose />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{userName}</Text>

        <FlatList
          data={currentPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Post
              id={item.id}
              source={item.photoUri}
              title={item.photoTitle}
              country={item.locationTitle}
              coords={item.location}
              comment={item.comment}
            />
          )}
        ></FlatList>
      </View>
    </ImageBackgroundComponent>
  );
};

const styles = StyleSheet.create({
  profileScreenContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#fff",
    width: "100%",
    height: "80%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  userPhoto: {
    width: 120,
    height: 120,
    borderRadius: 16,
    position: "absolute",
    top: -60,
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  closeButtonWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: -50,
    right: -12.5,
  },
  title: {
    marginTop: 92,
    marginBottom: 32,
    fontSize: 30,
    fontWeight: 600,
    color: "#212121",
    textAlign: "center",
  },
});

export default ProfileScreen;
