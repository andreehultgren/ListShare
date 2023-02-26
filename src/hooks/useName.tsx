import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function useName(): [string | undefined | null, Function] {
  const [name, setName] = useState<string | undefined | null>(null);
  const auth = getAuth();
  const email = auth?.currentUser?.email;

  useEffect(() => {
    // Check if we have a user
    if (!!!email) {
      setName(null);
      return;
    }
    // Update the name whenever it updates
    const unsub = onSnapshot(doc(db, "users", email), (doc) => {
      const foundName = doc.get("name");
      if (!!foundName) {
        setName(foundName);
      } else {
        setName(undefined);
      }
    });
    return unsub;
  }, [email]);

  // Set the function so we can change the name
  function updateName(newName: string) {
    if (!!email) {
      const userRef = doc(db, "users", email);
      setDoc(userRef, { name: newName }, { merge: true });
    }
  }

  return [name, updateName];
}
