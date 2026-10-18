
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(",")
    : false
}));

app.use(express.json({ limit: "20kb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PORT = process.env.PORT || 3000;
const MODEL = process.env.OPENAI_MODEL;

app.get("/", (req, res) => {
  res.send("Servidor de la IA en funcionament!");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Escriu una pregunta."
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "La pregunta és massa llarga."
      });
    }

    if (!MODEL) {
      return res.status(500).json({
        error: "Falta configurar el model de la IA."
      });
    }

    const response = await openai.responses.create({
      model: MODEL,
      instructions:
        "Ets un assistent educatiu d'una web sobre la Revolució Francesa. " +
        "Respon en català, amb paraules senzilles i de manera clara. " +
        "Ajuda a entendre la història i no inventis dades.",
      input: message,
      max_output_tokens: 500
    });

    res.json({
      reply: response.output_text
    });
  } catch (error) {
    console.error("Error en la petició a la IA:", error.message);

    res.status(500).json({
      error: "La IA no ha pogut respondre. Torna-ho a provar."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor actiu al port ${PORT}`);
});
