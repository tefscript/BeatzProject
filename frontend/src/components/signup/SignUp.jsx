import React, { useState } from "react";
import "@/components/signup/SignUp.css";
import Icon from "@/components/icon/Icon";
import SignUpForm from "@/components/signup/SignUpForm";

const SignUp = () => {
  return (
    <div>
      <header className="beatzheader">
        <Icon name="beatz" alt="Beatz" className="logo-beatz" />
        <hr />
      </header>

      <div className="container">
        <h1 className="h1sign">Sign up and turn up the music.</h1>

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

        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;