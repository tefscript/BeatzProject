import React, { useState } from "react";
import api from "@/config/api";
import "@/components/login/LoginForm.css";
import { useUser } from "@/context/UserContext";
import supabase from "@/config/supabaseClient";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveUser } = useUser();
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("Tentando login com:", email);
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Login bem-sucedido:", response.data);
      localStorage.setItem("token", response.data.token);
      saveUser({ name: response.data.user.name, email: response.data.user.email, avatar: null });
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      
      if (error.response?.status === 401) {
        setError("Email ou senha incorretos");
      } else if (error.response?.status === 400) {
        setError(error.response.data.error || "Dados inválidos");
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const inputEmail = email || window.prompt("Digite seu email para redefinir a senha:");
    if (!inputEmail) return;
    setResetMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(inputEmail, { redirectTo: window.location.origin + "/login" });
      if (error) throw error;
      setResetMessage("Enviamos um link de redefinição para seu email.");
    } catch (err) {
      setResetMessage("Erro ao enviar email de redefinição: " + (err.message || err.error_description));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="email-password">
        <label>Email address</label>
        <input
          className="login-signup-input"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-signup-input"
          disabled={loading}
        />
      </div>

      {/* Mensagem de erro */}
      {error && <div className="error-message">{error}</div>}

      <div className="forgetpassword">
        <a href="#" onClick={handleForgotPassword}>Forget your password?</a>
      </div>

      {resetMessage && <div className="reset-message">{resetMessage}</div>}

      <div className="button-login">
        <button className="login" type="submit" disabled={loading}>
          {loading ? "LOGANDO..." : "LOG IN"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
