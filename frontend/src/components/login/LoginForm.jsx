import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("Login bem-sucedido:", response.data);
      localStorage.setItem("token", response.data.token);
      window.location.href = "/";

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // <- vem do backend
      } else {
        setError("Erro ao fazer login");
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="email-password">
        <label>Email address</label>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Mensagem de erro */}
      {error && <div className="error-message">{error}</div>}

      <div className="button-login">
        <button className="login" type="submit">LOG IN</button>
      </div>
    </form>
  );
};

export default LoginForm;