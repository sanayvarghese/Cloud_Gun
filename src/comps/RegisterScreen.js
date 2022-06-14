import React, { useRef } from "react";
import { auth } from "../firebase/config";

export default function RegisterScreen() {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmpassword = useRef(null);

  const signup = (e) => {
    if (passwordRef.current.value === confirmpassword.current.value) {
      e.preventDefault();

      auth
        .createUserWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
        )
        .then((authUser) => {
          authUser.user.updateProfile({
            displayName: nameRef,
          });
        })
        .catch((error) => alert(error));
    } else {
      alert("Password doesn't match");
    }
  };
  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <div className="card card-body">
              <h1 className="text-center mb-3">
                <i className="fas fa-user-plus"></i> Register
              </h1>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Username"
                  ref={nameRef}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  ref={emailRef}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  ref={passwordRef}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  className="form-control"
                  placeholder="Confirm Password"
                  ref={confirmpassword}
                />
              </div>
              <button
                onClick={signup}
                className="btn btn-primary btn-block"
                style={{
                  backgroundColor: "#000",
                  textAlign: "center",
                  textTransform: "uppercase",
                  width: 90,
                  height: 30,
                }}
              >
                Register
              </button>

              <p className="lead mt-4">
                Already have an account?{" "}
                <a href="/" style={{ color: "#000", textDecoration: "none" }}>
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
