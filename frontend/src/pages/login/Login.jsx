import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@/pages/login/Login.css";
import LoginForm from "@/components/login/LoginForm";
import BeatzHeader from "@/components/header/Header";
import LoginCredentials from "@/components/loginCredentials/LoginCredentials";
import supabase from "@/config/supabaseClient";
import api from "@/config/api";
import { useUser } from "@/context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { saveUser } = useUser();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      console.log("Usuário do Supabase:", user);
      
      if (user) {
        try {
          console.log("Tentando login social com:", user.email);
          const res = await api.post("/api/auth/social-login", {
            email: user.email,
            name: user.user_metadata?.name || user.email,
          });
          console.log("Resposta do backend:", res.data);
          localStorage.setItem("token", res.data.token);
          // Salva nome, email e avatar (se disponível)
          saveUser({
            name: res.data.user.name || user.user_metadata?.name || user.email,
            email: res.data.user.email || user.email,
            avatar: user.user_metadata?.avatar_url || null
          });
          navigate("/");
        } catch (err) {
          console.error("Erro no login social:", err);
          await supabase.auth.signOut();
          alert(`Erro ao autenticar com o backend: ${err.response?.data?.error || err.message}. Tente novamente.`);
        }
      }
    };
    checkSession();
    // Escuta mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Evento de auth:", event, session?.user);
      if (event === 'SIGNED_IN' && session?.user) {
        checkSession();
      }
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [navigate, saveUser]);

  return (
    <div className="body-login">
      <BeatzHeader />

      <div className="container-login">
        <LoginCredentials />

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