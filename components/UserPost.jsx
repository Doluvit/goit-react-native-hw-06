import { View, Image, StyleSheet, Text } from "react-native";
import {
  IconComment,
  IconLike,
  IconLocalPosition,
  IconTrashBucket,
} from "../assets/icons/icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { deleteDataFromFirestore } from "../helpers/postsControllers";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config";

const UserPost = ({ source, title, comment, country, coords, id }) => {
  const [commentData, setCommentData] = useState([]);
  const [location, setLocation] = useState(null);

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
        <TouchableOpacity
          onPress={() => deleteDataFromFirestore(id)}
          style={{
            position: "absolute",
            right: 5,
            top: 5,
            width: 30,
            height: 30,
            borderRadius: 20,
            backgroundColor: "#F6F6F6",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <IconTrashBucket />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text>
              <IconLike />
            </Text>
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
            {country}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserPost;

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
