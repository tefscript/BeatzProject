import React, { useState } from "react";
import "@/components/login/login.css";
import Icon from "@/components/icon/Icon";

const Login = () => {
  return (
    <div>
      <header className="beatzheader">
        <Icon
          name="beatz"
          alt="Beatz"
          className="logo-beatz"
        />
        <hr />
      </header>

      <div className="container">
        <form>
          <div>
            <button className="facebook">
              <Icon
                name="facebook"
                alt="Facebook"
                className="logo-facebook"
              />
              <span className="button-text">CONTINUE WITH FACEBOOK</span>
            </button>
          </div>
          <div>
            <button className="apple">
              <Icon
                name="apple"
                alt="Apple"
                className="logo-apple"
              />
              <span className="button-text">CONTINUE WITH APPLE</span>
            </button>
          </div>
          <div>
            <button className="google">
              <Icon
                name="google"
                alt="Google"
                className="logo-google"
              />
              <span className="button-text">CONTINUE WITH GOOGLE</span>
            </button>
          </div>
          <div className="or">
            <hr />
            <a>OR</a>
            <hr />
          </div>
          <div className="email-password">
            <a>Email address</a>
            <input type="email" placeholder="Email address" />
            <br />
            <a>Password</a>
            <input type="password" placeholder="Password" />
          </div>

          <div className="forgetpassword">
            <a href="#">Forget your password?</a>
          </div>

          <div className="button-login">
            <button className="login">LOG IN</button>
          </div>

          <hr className="hr3"/>
          <div className="signup">
            <br />
            <p>
              Don't have an account?
              <br />
              <button className="signbeatz">Sign up for BEATZ</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
