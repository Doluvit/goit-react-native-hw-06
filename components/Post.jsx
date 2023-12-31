import { View, Image, StyleSheet, Text } from "react-native";
import {
  IconComment,
  IconLocalPosition,
} from "../assets/icons/icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { deleteDataFromFirestore } from "../helpers/postsControllers";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config";

const Post = ({ source, title, comment, city, country, coords, id }) => {
  const [commentData, setCommentData] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => {
        const newComment = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCommentData(newComment);
      }
    );
    return () => unsubscribe();
  }, []);
  return (
    <View style={{ marginBottom: 32 }}>
      <View style={{ marginBottom: 8 }}>
        <Image
          source={{ uri: source }}
          resizeMode={"cover"}
          style={{ width: "100%", height: 240, borderRadius: 8 }}
        />
      </View>
      <Text style={styles.title}>{title}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CommentsScreen", {
                source,
                id,
              });
            }}
          >
            <Text>
              <IconComment />
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.text,
              {
                color: "#BDBDBD",
              },
            ]}
          >
            {commentData.length}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MapScreen", {
                coords,
              });
            }}
          >
            <Text>
              <IconLocalPosition />
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.text,
              {
                color: "#212121",
                textDecorationLine: "underline",
              },
            ]}
          >
            {`${city}, ${country}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18.75,
  },
  title: {
    marginBottom: 8,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 18.75,
    color: "#212121",
  },
});
