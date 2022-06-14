import React, { useRef } from "react";
import { auth } from "../firebase/config";
export default function LoginScreen() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const signin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .catch((err) => alert(err));
  };
  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <div className="card card-body">
              <h1 className="text-center mb-3" color="#000">
                <i className="fas fa-sign-in-alt"></i> Login
              </h1>

              <div className="form-group">
                <label color="#000">Email</label>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  ref={passwordRef}
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                />
              </div>
              <button
                onClick={signin}
                className="btn btn-primary btn-block"
                style={{
                  backgroundColor: "#000",
                  textAlign: "center",
                  textTransform: "uppercase",
                  width: 80,
                  height: 30,
                }}
              >
                Login
              </button>

              <p className="lead mt-4" color="#5a5a5a">
                Don't have an account?{" "}
                <a
                  href="/register"
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
