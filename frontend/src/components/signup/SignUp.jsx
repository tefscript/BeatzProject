import React, { useState } from "react";
import "@/components/signup/SignUp.css";
import Icon from "@/components/icon/Icon";

const SignUp = () => {
    const [isChecked, setIsChecked] = useState(false); // Para controlar o estado do checkbox

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked); // Alterna o estado do checkbox
    };

  return (
    <div>
      <header className="beatzheader">
        <Icon name="beatz" alt="Beatz" className="logo-beatz" />
        <hr />
      </header>

      <div className="container">
        <form>

            <h1 className="h1sign">Sign up and turn up the music.</h1>
            
          <div>
            <button className="facebook">
              <Icon name="facebook" alt="Facebook" className="logo-facebook" />
              <span className="button-text">CONTINUE WITH FACEBOOK</span>
            </button>
          </div>
          <div>
            <button className="apple">
              <Icon name="apple" alt="Apple" className="logo-apple" />
              <span className="button-text">CONTINUE WITH APPLE</span>
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
          <div className="email-password">
            <a>Email address</a>
            <input type="email" placeholder="Email address" />
            <br />
            <a>Password</a>
            <input type="password" placeholder="Password" />
          </div>

          <div className="forgetpassword">
            <a href="#">Your profile will show this name</a>
          </div>

           {/* Checkbox para os Termos */}
           <div className="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>.
            </label>
          </div>

          <div className="button-login">
            <button className="login">LOG IN</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
