import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  onSnapshot,
  addDoc,
  collection,
  getDoc,
} from "firebase/firestore";
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

export function useListKeys(): [
  string[],
  (newName: string) => Promise<string | undefined>,
  (keyName: string, target: string) => Promise<any>,
  (keyName: string) => void
] {
  const [listKeys, setListKeys] = useState<string[]>([]);
  const auth = getAuth();
  const email = auth?.currentUser?.email;

  useEffect(() => {
    // Check if we have a user
    if (!!!email) {
      setListKeys([]);
      return;
    }
    // Update the name whenever it updates
    const unsub = onSnapshot(doc(db, "users", email), (doc) => {
      const lists = doc.get("lists");
      if (!!lists) {
        setListKeys(lists);
      } else {
        setListKeys([]);
      }
    });
    return unsub;
  }, [email]);

  async function createList(newName: string) {
    if (!!!email) {
      return;
    }
    const newList = {
      name: newName,
      items: [],
    };
    const listCollection = collection(db, "lists");
    const docRef = await addDoc(listCollection, newList);
    const listKey = docRef.id;

    const userRef = doc(db, "users", email);
    setDoc(userRef, { lists: [...listKeys, listKey] }, { merge: true });

    return listKey;
  }

  async function shareList(keyName: string, target: string) {
    if (!!!email) {
      return;
    }
    const otherEmail = target.toLowerCase();
    const userRef = doc(db, "users", otherEmail);
    const user = await getDoc(userRef);
    if (user.exists()) {
      const userData = user.data();
      const lists: string[] | undefined = userData.lists;
      if (lists === undefined) {
        setDoc(userRef, { lists: [keyName] }, { merge: true });
      } else if (!lists.includes(keyName)) {
        let newLists = [...lists, keyName];
        setDoc(userRef, { lists: newLists }, { merge: true });
      }
    }
  }
  function deleteList(keyName: string) {
    if (!!!email) {
      return;
    }

    let newList = listKeys.filter((k) => k !== keyName);
    const userRef = doc(db, "users", email);
    setDoc(userRef, { lists: newList }, { merge: true });
  }

  return [listKeys, createList, shareList, deleteList];
}
