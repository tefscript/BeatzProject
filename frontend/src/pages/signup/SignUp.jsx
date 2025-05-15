import React from "react";
import "@/pages/signup/SignUp.css";
import SignUpForm from "@/components/signup/SignUpForm";
import BeatzHeader from "@/components/header/Header";
import LoginCredentials from "@/components/loginCredentials/LoginCredentials";

const SignUp = () => {
  return (
    <div className="body-signup">
      <BeatzHeader />

      <div className="container-signup">
        <h1 className="h1sign">Sign up and turn up the music.</h1>

        <LoginCredentials />

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