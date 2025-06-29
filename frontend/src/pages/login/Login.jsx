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
      console.log("=== Verificando sessão do Supabase ===");
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      console.log("Usuário do Supabase:", user);
      console.log("Sessão completa:", data.session);
      
      if (user) {
        try {
          console.log("=== Iniciando login social ===");
          console.log("Email do usuário:", user.email);
          console.log("Metadata do usuário:", user.user_metadata);
          
          const res = await api.post("/api/auth/social-login", {
            email: user.email,
            name: user.user_metadata?.name || user.email,
          });
          console.log("Resposta do backend:", res.data);
          
          localStorage.setItem("token", res.data.token);
          console.log("Token salvo no localStorage");
          
          // Verifica se o token foi salvo corretamente
          const savedToken = localStorage.getItem("token");
          console.log("Token verificado após salvar:", savedToken ? "SIM" : "NÃO");
          
          // Salva nome, email e avatar (se disponível)
          const userData = {
            name: res.data.user.name || user.user_metadata?.name || user.email,
            email: res.data.user.email || user.email,
            avatar: user.user_metadata?.avatar_url || null
          };
          console.log("Dados do usuário a serem salvos:", userData);
          saveUser(userData);
          
          console.log("=== Redirecionando para home ===");
          // Pequeno timeout para garantir que os dados sejam salvos
          setTimeout(() => {
            window.location.href = "/";
          }, 100);
        } catch (err) {
          console.error("=== Erro no login social ===");
          console.error("Erro completo:", err);
          console.error("Response data:", err.response?.data);
          console.error("Response status:", err.response?.status);
          
          await supabase.auth.signOut();
          alert(`Erro ao autenticar com o backend: ${err.response?.data?.error || err.message}. Tente novamente.`);
        }
      } else {
        console.log("Nenhum usuário encontrado na sessão do Supabase");
      }
    };
    
    checkSession();
    
    // Escuta mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("=== Evento de auth do Supabase ===");
      console.log("Evento:", event);
      console.log("Sessão:", session);
      console.log("Usuário:", session?.user);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("Usuário fez sign in, verificando sessão...");
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