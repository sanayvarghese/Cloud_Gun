import { useState, useEffect } from "react";
import {
  projectStorage,
  projectFirestore,
  timestamp,
  auth,
} from "../firebase/config";

const useStorage = (files, extensions) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState([]);
  var today = new Date();
  var date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getMinutes();

  useEffect(() => {
    // eslint-disable-next-line
    files.map((file, index) => {
      const storageRef = projectStorage.ref(date + "-" + file.name);
      const collectionRef = projectFirestore
        .collection("images")
        .doc(auth?.currentUser?.uid)
        .collection("url");

      storageRef.put(file).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
        },
        async () => {
          const url = await storageRef.getDownloadURL();
          const createdAt = timestamp();
          const extension = extensions[index];
          await collectionRef.add({ url, createdAt, extension });
          setUrl((prevState) => [...prevState, url]);
        }
      );
    });
    setProgress(0);
    // eslint-disable-next-line
  }, [files]);

  return { progress, url, error };
};

export default useStorage;
