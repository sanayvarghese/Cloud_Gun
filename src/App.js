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
import { auth, projectFirestore } from "./firebase/config";

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
                style={{ fontSize: 18, cursor: "pointer" }}
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

              <UploadForm />
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
            <a href="https://www.dragongear.tk" className="a2">
              {" "}
              Dragon Gear
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
              s
              onClick={() => setSelectedImg(doc.url)}
            >
              <a href={doc.url} className="alt-grey" target="_blank">
                <motion.img
                  src={doc.url}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "2.png";
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
                <i class="fas fa-download"></i>
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
                marginLeft: 60,
              }}
              onClick={(e) => {
                window.confirm("Do you really want to delete this document?") &&
                  projectFirestore
                    .collection("images")
                    .doc(auth?.currentUser?.uid)
                    .collection("url")
                    .doc(doc.id)
                    .delete();
              }}
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
    </div>
  );
}

function UploadForm() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    let selected = e.target.files[0];
    // File Type
    if (selected) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please Select a File)");
    }
  };

  return (
    <form>
      <label className="label">
        <input
          className="labelinput"
          type="file"
          onChange={handleChange}
          multiple
        />
        <span>+</span>
      </label>
      <div className="output">
        {error && <div className="error">{error}</div>}
        {file && <div>{file.name}</div>}
        {file && <ProgressBar file={file} setFile={setFile} />}
      </div>
    </form>
  );
}

export default App;
