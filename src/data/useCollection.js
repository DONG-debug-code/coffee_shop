import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dulieu } from "./connectdata";

export const useRealtimeCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;

    const colRef = collection(dulieu, collectionName);

    const unsub = onSnapshot(
      colRef,
      (snapshot) => {
        const result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [collectionName]);

  return { data, setData, loading, error };
};
