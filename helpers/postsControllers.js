import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config";

export const writeDataToFirestore = async (newPost) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), newPost);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const deleteDataFromFirestore = async (id) => {
  try {
    const postToDelete = doc(db, "posts", id);
    return deleteDoc(postToDelete);
  } catch (error) {
    console.log(error);
  }
};
