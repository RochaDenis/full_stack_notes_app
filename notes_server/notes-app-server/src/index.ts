// Importando as dependências necessárias
import express from "express";
import cors from "cors";
import { Prisma, PrismaClient } from "@prisma/client";

// Inicializando o aplicativo Express
const app = express();

// Inicializando o cliente Prisma
const prisma = new PrismaClient();

// Configurando o middleware para lidar com requisições JSON
app.use(express.json());

// Configurando o middleware para lidar com CORS
app.use(cors());

// Rota para obter todas as notas
app.get("/api/notes", async (req, res) => {
    // Obtendo todas as notas do banco de dados usando o Prisma
    const notes = await prisma.note.findMany();

    // Retornando as notas como resposta em formato JSON
    res.json(notes);
});

// Rota para criar uma nova nota
app.post("/api/notes", async (req, res) => {
    // Obtendo o título e o conteúdo da nota do corpo da requisição
    const { title, content } = req.body;

    // Verificando se o título e o conteúdo foram fornecidos
    if (!title || !content) {
        // Retornando um erro de status 400 se o título ou o conteúdo estiverem faltando
        return res.status(400).send({ error: "Title and content fields required" });
    }

    try {
        // Criando uma nova nota no banco de dados usando o Prisma
        const note = await prisma.note.create({
            data: { title, content },
        });

        // Retornando a nova nota como resposta em formato JSON
        res.json(note);

    } catch (error) {
        // Retornando um erro de status 500 se ocorrer um erro ao criar a nota
        res.status(500).send({ error: "Error creating note" });
    }
});

// Rota para atualizar uma nota existente
app.put("/api/notes/:id", async (req, res) => {
    // Obtendo o título, o conteúdo e o ID da nota do corpo e dos parâmetros da requisição
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    // Verificando se o título, o conteúdo e o ID foram fornecidos corretamente
    if (!title || !content) {
        // Retornando um erro de status 400 se o título ou o conteúdo estiverem faltando
        return res.status(400).send({ error: "Title and content fields required" });
    }
    if (!id || isNaN(id)) {
        // Retornando um erro de status 400 se o ID da nota for inválido
        return res.status(400).send({ error: "Invalid note id" });
    }

    try {
        // Atualizando a nota no banco de dados usando o Prisma
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content },
        });

        // Retornando a nota atualizada como resposta em formato JSON
        res.json(updatedNote);
    } catch (error) {
        // Retornando um erro de status 500 se ocorrer um erro ao atualizar a nota
        res.status(500).send({ error: "Error updating note" });
    }
});

// Rota para excluir uma nota existente
app.delete("/api/notes/:id", async (req, res) => {
    // Obtendo o ID da nota dos parâmetros da requisição
    const id = parseInt(req.params.id);

    // Verificando se o ID da nota foi fornecido corretamente
    if (!id || isNaN(id)) {
        // Retornando um erro de status 400 se o ID da nota for inválido
        return res.status(400).send({ error: "Invalid note id" });
    }

    try {
        // Excluindo a nota do banco de dados usando o Prisma
        await prisma.note.delete({
            where: { id },
        });

        // Retornando uma resposta de status 204 (No Content) para indicar que a nota foi excluída com sucesso
        res.status(204).send();
    } catch (error) {
        // Retornando um erro de status 500 se ocorrer um erro ao excluir a nota
        res.status(500).send({ error: "Error deleting note" });
    }
});

// Iniciando o servidor na porta 5000
app.listen(5000, () => {
    console.log("server running on port 5000");
});
