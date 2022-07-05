import React, { useState, useEffect } from "react";
import Title from "./comps/Title";
import LoginScreen from "./comps/LoginScreen";
import Modal from "./comps/Modal";
import Register from "./comps/RegisterScreen";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./themes.js";
import useFirestore from "./hooks/useFirestore";
import { motion } from "framer-motion";
import ProgressBar from "./comps/ProgressBar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { auth, projectFirestore, projectStorage } from "./firebase/config";

const StyledApp = styled.div`
  color: ${(props) => props.theme.fontColor};
`;
function App() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      const user = {
        uid: userAuth?.uid,
        email: userAuth?.email,
      };
      if (userAuth) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  const signout = () => {
    auth.signOut();
  };
  return (
    <div>
      {user ? (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <GlobalStyles />
          <StyledApp>
            <div className="App">
              <Title />
              <button
                onClick={signout}
                style={
                  theme === "light"
                    ? {
                        color: "#000",
                        fontSize: 18,
                        cursor: "pointer",
                      }
                    : {
                        color: "#fff",
                        fontSize: 18,
                        cursor: "pointer",
                      }
                }
                className="signout"
              >
                <i
                  className="fas fa-sign-out-alt"
                  style={{ marginRight: 5 }}
                ></i>
                SignOut
              </button>
              <label className="switch">
                <input type="checkbox" />
                <span
                  className="slider round"
                  onClick={() => themeToggler()}
                ></span>{" "}
              </label>

              <UploadForm theme={theme} />
              <ImageGrid setSelectedImg={setSelectedImg} />
              {selectedImg && (
                <Modal
                  selectedImg={selectedImg}
                  setSelectedImg={setSelectedImg}
                />
              )}
            </div>
          </StyledApp>

          <footer id="main-footer">
            &copy; Made By
            <a href="https://sanayvarghese.tk" className="a2">
              {" "}
              Sanay Varghese
            </a>
          </footer>
        </ThemeProvider>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/" component={LoginScreen} />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

function ImageGrid({ setSelectedImg }) {
  const { docs } = useFirestore("images");
  const images = (doc) => {
    const ext = doc.extension;
    if (ext === "css") {
      return "images/css.png";
    } else if (ext === "html") {
      return "images/html.png";
    } else if (ext === "js") {
      return "images/js.png";
    } else if (ext === "srt") {
      return "images/srt.png";
    } else if (ext === "txt") {
      return "images/txt.png";
    } else if (ext === "pdf") {
      return "images/pdf.png";
    } else if (ext === "exe") {
      return "images/exe.png";
    } else if (ext === "ttf" || ext === "otf" || ext === "woff") {
      return "images/font.png";
    } else if (ext === "py" || ext === "pyw" || ext === "x-python") {
      return "images/py.png";
    } else if (
      ext === "mp4" ||
      ext === "mkv" ||
      ext === "avi" ||
      ext === "mov" ||
      ext === "wmv" ||
      ext === "mpg" ||
      ext === "mpeg" ||
      ext === "flv" ||
      ext === "webm"
    ) {
      return "images/video.png";
    } else if (ext === "docx" || ext === "doc" || ext === "dot") {
      return "images/word.png";
    } else if (ext === "xls" || ext === "xlsx" || ext === "xlsm") {
      return "images/xls.png";
    } else if (
      ext === "zip" ||
      ext === "7zip" ||
      ext === "tar" ||
      ext === "rar"
    ) {
      return "images/zip.png";
    } else if (
      ext === "json" ||
      ext === "md" ||
      ext === "yaml" ||
      ext === "yml" ||
      ext === "xml" ||
      ext === "config" ||
      ext === "conf" ||
      ext === "toml"
    ) {
      return "images/settings.png";
    } else {
      return "2.png";
    }
  };
  return (
    <div className="img-grid">
      {docs &&
        docs.map((doc) => (
          <div className="img-wrap-div">
            <motion.div
              className="img-wrap"
              key={doc.id}
              layout
              whileHover={{ opacity: 1 }}
              onClick={() => setSelectedImg(doc.url)}
            >
              <a
                href={doc.url}
                className="alt-grey"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.img
                  src={doc.url}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = images(doc);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                />
              </a>
            </motion.div>
            <a
              href={doc.url}
              target="_blank"
              download={true}
              rel="noopener noreferrer"
            >
              <button
                style={{
                  backgroundColor: "#1434A4",
                  color: "#fff",
                  textAlign: "center",
                  textTransform: "uppercase",
                  width: 55,
                  height: 30,
                  marginTop: 10,
                }}
              >
                <i className="fas fa-download"></i>
              </button>
            </a>
            <button
              style={{
                backgroundColor: "#DC143C",
                color: "#fff",
                textAlign: "center",
                textTransform: "uppercase",
                width: 30,
                height: 30,
                marginTop: 10,
                marginLeft: 10,
              }}
              onClick={(e) => {
                window.confirm("Do you really want to delete this document?") &&
                  projectStorage.refFromURL(doc.url).delete() &&
                  projectFirestore
                    .collection("images")
                    .doc(auth?.currentUser?.uid)
                    .collection("url")
                    .doc(doc.id)
                    .delete();
              }}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
    </div>
  );
}

function UploadForm({ theme }) {
  const [files, setFiles] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [error, setError] = useState(null);

  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    let selected = e.dataTransfer.files;
    if (selected.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const targetfiles = e.dataTransfer.files[i];
        const extds = e.dataTransfer.files[i].name;
        const ds = extds
          .split("")
          .reverse()
          .join("")
          .split(".")[0]
          .split("")
          .reverse()
          .join("");
        console.log(ds);
        targetfiles["id"] = Math.random();
        setFiles((prevState) => [...prevState, targetfiles]);
        setExtensions((prevState) => [...prevState, ds]);
      }
      setError("");
    } else {
      setFiles(null);
      setError("Please Select a File)");
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    let selected = e.target.files;
    if (selected.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        const targetfiles = e.target.files[i];
        const extds = e.target.files[i].name;
        const ds = extds
          .split("")
          .reverse()
          .join("")
          .split(".")[0]
          .split("")
          .reverse()
          .join("");
        console.log(ds);
        targetfiles["id"] = Math.random();
        setFiles((prevState) => [...prevState, targetfiles]);
        setExtensions((prevState) => [...prevState, ds]);
      }
      setError("");
    } else {
      setFiles(null);
      setError("Please Select a File)");
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <form
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      >
        <div>
          <button
            className="upload-button"
            onClick={onButtonClick}
            style={theme === "dark" ? { color: "#cbd5e1" } : { color: "#000" }}
          >
            Upload files
          </button>
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
      <div className="output">
        {error && <div className="error">{error}</div>}
        {files && <div>{files.name}</div>}
        {files && (
          <ProgressBar
            files={files}
            setFiles={setFiles}
            extensions={extensions}
            setExtensions={setExtensions}
          />
        )}
      </div>
    </form>
  );
}

export default App;
