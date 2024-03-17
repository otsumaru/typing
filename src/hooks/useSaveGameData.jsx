import React from "react";
import { db } from "../firebaseInit";
import { addDoc, collection } from "firebase/firestore";

const useSaveGameData = () => {
  // 結果をfirebaseに保存
  const saveScore = async (user, score) => {
    const playerData = {
      PlayerId: user ? user.uid : "anonymous",
      playerName: user ? user.displayName : "Anonymous Player",
      playerScore: score,
      createdAt: new Date(), // スコアが追加された日時も保存
    };

    try {
      const docRef = await addDoc(collection(db, "scores"), playerData);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return { saveScore };
};

export default useSaveGameData;
