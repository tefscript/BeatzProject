const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//rota inicial (teste)
app.get("/", (req, res) => {
    res.send("Beatz API rodando");
});

//teste da conexão com o banco
app.get("/test-db", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.send(`Conexão com o banco de dados OK`);
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        res.status(500).send("Erro ao conectar ao banco de dados");
    }
});

//iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});