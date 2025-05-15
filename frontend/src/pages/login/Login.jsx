import React from "react";
import { Link } from "react-router-dom";
import "@/pages/login/Login.css";
import LoginForm from "@/components/login/LoginForm";
import BeatzHeader from "@/components/header/Header";
import LoginCredentials from "@/components/loginCredentials/LoginCredentials";

const Login = () => {
  return (
    <div className="body-login">
      <BeatzHeader />

      <div className="container-login">
        <LoginCredentials />

        <div className="or">
          <hr />
          <a>OR</a>
          <hr />
        </div>

        <LoginForm />

        <hr className="hr3" />
        <div className="signup">
          <br />
          <p>Don't have an account?</p>
          <br />
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button className="signup-button">Sign up with Beatz</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;