import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface IItem {
  name: string;
  quantity: string;
  done: boolean;
}

interface IList {
  name: string;
  key: string;
  items: IItem[];
}

export function useList(
  listKey: string
): [IList | null, (text: string) => void, (text: IItem[]) => void] {
  const [list, setList] = useState<IList | null>(null);
  const auth = getAuth();
  const email = auth?.currentUser?.email;

  useEffect(() => {
    // Check if we have a user
    if (!!!email) {
      setList(null);
      return;
    }
    // Update the name whenever it updates
    const unsub = onSnapshot(doc(db, "lists", listKey), (doc) => {
      const foundData = doc.data();
      if (foundData) {
        // @ts-ignore
        setList(foundData);
      }
    });
    return unsub;
  }, [email]);

  function setName(newName: string) {
    if (!!!email) {
      return;
    }
    const userRef = doc(db, "lists", listKey);
    setDoc(userRef, { name: newName }, { merge: true });
  }

  function setItems(newItems: IItem[]) {
    if (!!!email) {
      return;
    }
    const userRef = doc(db, "lists", listKey);
    setDoc(userRef, { items: newItems }, { merge: true });
  }

  return [list, setName, setItems];
}
