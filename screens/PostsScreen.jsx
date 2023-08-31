import { View, Image, Text, StyleSheet } from "react-native";
import Post from "../components/Post";
import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../config";
import { onAuthStateChanged } from "firebase/auth";
import { selectAuthState, selectUserName } from "../redux/selectors";
import { useSelector } from "react-redux";

const PostsScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPosts, setCurrentPosts] = useState([]);
  const userId = useSelector(selectAuthState);
  const displayName = useSelector(selectUserName);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);

      if (user) {
        const unsubscribePosts = onSnapshot(
          collection(db, "posts"),
          (snapshot) => {
            const newPost = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            const userPosts = newPost.filter((post) => post.userId === userId);
            setCurrentPosts(userPosts);
          }
        );
        return () => {
          unsubscribePosts();
        };
      } else {
        setCurrentPosts([]);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCurrentPosts(newData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          <Image source={require("../assets/images/user.jpg")} />
          <View
            style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
          >
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
    backgroundColor: "#fff",
  },
  userInfo: {
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    marginBottom: 32,
  },
  userName: {
    fontFamily: "Roboto-Medium",
    lineHeight: 15.23,
    fontSize: 13,
  },
  userEmail: {
    fontFamily: "Roboto-Regular",
    lineHeight: 12.89,
    fontSize: 11,
    color: "#212121CC",
  },
});

export default PostsScreen;
