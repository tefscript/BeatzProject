import React, { useState } from "react";
import "./login.css";
import BeatzLogo from "../../assets/BeatzLogo2.svg";

const Login = () => {
  return (
    <div className="container">
      <header className="beatzheader">
        <img
          src={BeatzLogo}
          alt="Beatz Logo"
          style={{ width: "150px", height: "auto" }}
        />
      </header>

      <form>
        <div>
          <button className="facebook">CONTINUE WITH FACEBOOK"</button>
        </div>
        <div>
          <button className="apple">CONTINUE WITH APPLE"</button>
        </div>
        <div>
          <button className="google">CONTINUE WITH GOOGLE</button>
        </div>
        <a>OR</a>
        <br />
        <br />
        <div>
          <a className="input-field">Email address</a>
          <br />
          <input type="email" placeholder="Email address" />
        </div>
        <div>
          <a>Email address</a>
          <br />
          <input type="password" placeholder="Password" />
        </div>
        <div className="forgetpassword">
          <a href="#">Forget your password?</a>
        </div>
        <button>LOG IN</button>

        <div className="signup">
          <br />
          <p>
            Don't have an account?
            <br />
            <button>Sign up for BEATZ</button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
