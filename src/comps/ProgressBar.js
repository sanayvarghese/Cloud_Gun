import React, { useEffect } from "react";
import useStorage from "../hooks/useStorage";
import { motion } from "framer-motion";

const ProgressBar = ({ files, setFiles, extensions, setExtensions }) => {
  const { progress, url } = useStorage(files, extensions);

  useEffect(() => {
    if (url && url.length >= 0) {
      setFiles([]);
      setExtensions([]);
    }
  }, [url, setFiles, setExtensions]);

  return (
    <motion.div
      className="progress-bar"
      initial={{ width: 0 }}
      animate={{ width: progress + "%" }}
    ></motion.div>
  );
};

export default ProgressBar;
