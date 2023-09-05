import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  } from "react-native";
import Comment from "../components/Comment";
import { IconArrowUp } from "../assets/icons/icons";
import { useRef } from "react";
import { db } from "../config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { FlatList } from "react-native-gesture-handler";
import UserComment from "../components/UserComment ";

const UserCommentsScreen = () => {
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false);
  const route = useRoute();
  const uri = route.params.source;
  const [comment, setComment] = useState("");
  const [commentsData, setCommentsData] = useState([]);
  const { id: postId } = route.params;

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const commentsRef = collection(db, "posts", postId, "comments");
    const commentsSnapshot = await getDocs(commentsRef);
    const comments = commentsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setCommentsData(comments);
  };

  const handleAddComment = async (postId, comment) => {
    if (comment.trim() !== "") {
      commentsCollection(postId, comment);
      getComments();
      setComment("");
    } 
  };
  const commentsCollection = async (postId, comment) => {
    const collectionRef = collection(db, "posts", postId, "comments");
    const timestamp = new Date().toISOString();

    try {
      await addDoc(collectionRef, { comment, timestamp });
    } catch (error) {
      console.log(error);
    }
  };
  const formatTimestamp = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const date = new Date(timestamp).toLocaleDateString("uk-UA", options);
    return `${date}`;
  };

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
                paddingBottom: isOpenKeyboard ? 105 : 34,
                height: isOpenKeyboard ? 16 : 34,
              },
            ]}
          >
            <Image
              source={{ uri: uri }}
              style={{
                width: "100%",
                height: 240,
                borderRadius: 8,
                marginBottom: 32,
              }}
            />
            <FlatList
              data={commentsData}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <UserComment
                  key={item.key}
                  image={require("../assets/images/authorIcon.jpg")}
                  text={item.comment}
                  date={formatTimestamp(item.timestamp)}
                />
              )}
            ></FlatList>
            <View style={styles.passwordInputContainer}>
              <TextInput
                onFocus={() => setIsOpenKeyboard(true)}
                onBlur={() => setIsOpenKeyboard(false)}
                value={comment}
                onChangeText={setComment}
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: "#F6F6F6",
                  borderWidth: 1,
                  borderColor: "#E8E8E8",
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 25,
                  fontSize: 16,
                  lineHeight: 19.36,
                }}
                placeholder="Коментувати"
              />
              <TouchableOpacity
                onPress={() => handleAddComment(postId, comment)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: "#FF6C00",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconArrowUp />
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
    backgroundColor: "#F6F6F6",
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

export default UserCommentsScreen;
