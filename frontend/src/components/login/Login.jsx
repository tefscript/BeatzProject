import React from "react";
import { Link } from "react-router-dom";
import "@/components/login/Login.css";
import Icon from "@/components/icon/Icon";
import LoginForm from "@/components/login/LoginForm";

const Login = () => {
  return (
    <div>
      <header className="beatzheader">
        <Icon name="beatz" alt="Beatz" className="logo-beatz" />
        <hr />
      </header>

      <div className="container">
        <div>
          <button className="facebook">
            <Icon name="facebook" alt="Facebook" className="logo-facebook" />
            <span className="button-text">CONTINUE WITH FACEBOOK</span>
          </button>
        </div>

        <div>
          <button className="google">
            <Icon name="google" alt="Google" className="logo-google" />
            <span className="button-text">CONTINUE WITH GOOGLE</span>
          </button>
        </div>

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