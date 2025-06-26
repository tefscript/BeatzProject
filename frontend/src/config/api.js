import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Adiciona o token JWT automaticamente se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token encontrado:", token ? "SIM" : "NÃO");
  console.log("URL da requisição:", config.url);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Header Authorization adicionado:", `Bearer ${token.substring(0, 20)}...`);
  } else {
    console.log("Nenhum token encontrado no localStorage");
  }
  
  return config;
});

// Interceptor para logs de resposta
api.interceptors.response.use(
  (response) => {
    console.log("Resposta bem-sucedida:", response.config.url);
    return response;
  },
  (error) => {
    console.log("Erro na requisição:", error.config?.url);
    console.log("Status do erro:", error.response?.status);
    console.log("Mensagem do erro:", error.response?.data);
    return Promise.reject(error);
  }
);

export default api; 