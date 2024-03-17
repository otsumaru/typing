import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseInit";

const useFetchRanking = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const q = query(
        collection(db, "your_collection_name"),
        orderBy("finalScore", "desc")
      );
      const querySnapshot = await getDocs(q);
      const rankingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRankings(rankingData);
    };

    fetchRanking();
  }, []);

  return rankings;
};

export default useFetchRanking;
