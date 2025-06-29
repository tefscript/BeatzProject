import React from "react";
import supabase from "@/config/supabaseClient.js";
import Icon from "@/components/icon/Icon";
import "@/components/loginCredentials/LoginCredentials.css";

function LoginCredentials() {
  const handleOAuthLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        console.error(`Erro no login ${provider}:`, error);
        alert(`Erro ao fazer login com ${provider}: ${error.message}`);
      }
    } catch (err) {
      console.error(`Erro inesperado no login ${provider}:`, err);
      alert(`Erro inesperado ao fazer login com ${provider}`);
    }
  };

  return (
    <div>
      <div>
        <button
          className="facebook"
          onClick={() => handleOAuthLogin("facebook")}
        >
          <Icon name="facebook" alt="Facebook" className="logo-facebook" />
          <span className="button-text">CONTINUE WITH FACEBOOK</span>
        </button>
      </div>

      <div>
        <button
          className="google"
          onClick={() => handleOAuthLogin("google")}
        >
          <Icon name="google" alt="Google" className="logo-google" />
          <span className="button-text">CONTINUE WITH GOOGLE</span>
        </button>
      </div>
    </div>
  );
}

export default LoginCredentials;