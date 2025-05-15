import React from "react";
import supabase from "@/config/supabaseClient.js";
import Icon from "@/components/icon/Icon";
import "@/components/loginCredentials/LoginCredentials.css";

function LoginCredentials() {
  return (
    <div>
      <div>
        <button
          className="facebook"
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "facebook" })
          }
        >
          <Icon name="facebook" alt="Facebook" className="logo-facebook" />
          <span className="button-text">CONTINUE WITH FACEBOOK</span>
        </button>
      </div>

      <div>
        <button
          className="google"
          onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
        >
          <Icon name="google" alt="Google" className="logo-google" />
          <span className="button-text">CONTINUE WITH GOOGLE</span>
        </button>
      </div>
    </div>
  );
}

export default LoginCredentials;