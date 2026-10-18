"use strict";

// MODO CLARO / OSCURO
const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", () => {
  const light = document.body.classList.toggle("light");
  themeButton.textContent = light ? "🌙" : "☀️";
  themeButton.setAttribute(
    "aria-label",
    light ? "Cambiar a modo oscuro" : "Cambiar a modo claro"
  );
});

// BUSCADOR DE TEMAS
const topicSearch = document.getElementById("topicSearch");
const topicCards = [...document.querySelectorAll(".topic-card")];
const noResults = document.getElementById("noResults");

topicSearch.addEventListener("input", () => {
  const query = topicSearch.value.trim().toLocaleLowerCase("es");
  let visible = 0;

  topicCards.forEach(card => {
    const content = (
      card.innerText + " " + card.dataset.search
    ).toLocaleLowerCase("es");

    const match = content.includes(query);
    card.hidden = !match;
    if (match) visible++;
  });

  noResults.hidden = visible !== 0;
});

// TEST DE HISTORIA
const questions = [
  {
    question: "¿En qué año comenzó la Revolución Francesa?",
    options: ["1776", "1789", "1799", "1815"],
    answer: 1,
    explanation: "La revolución comenzó en 1789."
  },
  {
    question: "¿Qué ocurrió el 14 de julio de 1789?",
    options: [
      "Napoleón fue coronado",
      "Se aprobó la Constitución de 1791",
      "La población tomó la Bastilla",
      "Se proclamó el Consulado"
    ],
    answer: 2,
    explanation: "La toma de la Bastilla se convirtió en un símbolo de la revolución."
  },
  {
    question: "¿Quién defendió la separación de poderes?",
    options: ["Montesquieu", "Luis XVI", "Robespierre", "Napoleón"],
    answer: 0,
    explanation: "Montesquieu defendió la separación de poderes."
  },
  {
    question: "¿Qué grupo constituía la mayor parte de la población?",
    options: ["La nobleza", "El clero", "La familia real", "El tercer estado"],
    answer: 3,
    explanation: "El tercer estado agrupaba a la mayoría de la población."
  },
  {
    question: "¿Qué sucedió en 1799?",
    options: [
      "Comenzó la revolución",
      "Napoleón dio un golpe de Estado",
      "Se tomó la Bastilla",
      "Se aprobó la Declaración de 1789"
    ],
    answer: 1,
    explanation: "El golpe de Estado de Napoleón dio paso al Consulado."
  }
];

let questionIndex = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;

const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizScore = document.getElementById("quizScore");
const checkAnswer = document.getElementById("checkAnswer");
const nextQuestion = document.getElementById("nextQuestion");

function renderQuestion() {
  const item = questions[questionIndex];
  selectedAnswer = null;
  answered = false;

  quizQuestion.innerHTML = "";
  const heading = document.createElement("h3");
  heading.textContent = `${questionIndex + 1}. ${item.question}`;
  quizQuestion.appendChild(heading);

  quizOptions.replaceChildren();

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;

    button.addEventListener("click", () => {
      if (answered) return;
      selectedAnswer = index;
      document.querySelectorAll(".quiz-option").forEach(b => {
        b.classList.remove("selected");
      });
      button.classList.add("selected");
    });

    quizOptions.appendChild(button);
  });

  quizFeedback.textContent = "";
  quizScore.textContent = `Pregunta ${questionIndex + 1} de ${questions.length} · Aciertos: ${score}`;
  checkAnswer.hidden = false;
  checkAnswer.disabled = false;
  nextQuestion.hidden = true;
  nextQuestion.textContent = questionIndex === questions.length - 1
    ? "Ver resultado →"
    : "Siguiente →";
}

checkAnswer.addEventListener("click", () => {
  if (answered || selectedAnswer === null) {
    if (selectedAnswer === null) {
      quizFeedback.textContent = "Selecciona una respuesta primero.";
    }
    return;
  }

  answered = true;
  const item = questions[questionIndex];
  const correct = selectedAnswer === item.answer;

  if (correct) score++;

  quizFeedback.textContent =
    (correct ? "¡Correcto! " : "No es correcto. ") + item.explanation;

  document.querySelectorAll(".quiz-option").forEach((button, index) => {
    button.disabled = true;
    if (index === item.answer) {
      button.style.borderColor = "#4ade80";
    } else if (index === selectedAnswer) {
      button.style.borderColor = "#f87171";
    }
  });

  checkAnswer.hidden = true;
  nextQuestion.hidden = false;
  quizScore.textContent = `Pregunta ${questionIndex + 1} de ${questions.length} · Aciertos: ${score}`;
});

nextQuestion.addEventListener("click", () => {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    quizQuestion.replaceChildren();
    const result = document.createElement("h3");
    result.textContent = `Resultado: ${score} de ${questions.length}`;
    quizQuestion.appendChild(result);

    quizOptions.replaceChildren();
    quizFeedback.textContent = score === questions.length
      ? "¡Perfecto! Has acertado todas."
      : "¡Buen trabajo! Repasa los temas e inténtalo otra vez.";

    quizScore.textContent = `Puntuación: ${Math.round(score / questions.length * 100)}%`;
    checkAnswer.hidden = true;
    nextQuestion.hidden = false;
    nextQuestion.textContent = "Repetir test";
    nextQuestion.onclick = () => {
      score = 0;
      questionIndex = 0;
      nextQuestion.onclick = null;
      renderQuestion();
    };
  }
});

renderQuestion();

// CHAT CON IA REAL
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

// Sustituye esta URL por la dirección real de tu servidor en Render.
// No pongas aquí tu clave privada de OpenAI.
const API_URL = "https://TU-SERVICIO.onrender.com";

function addMessage(text, role, isError = false) {
  const bubble = document.createElement("div");
  bubble.className = `message ${role}${isError ? " error" : ""}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

async function sendQuestion(question) {
  addMessage(question, "user");
  chatInput.value = "";
  chatInput.disabled = true;
  sendButton.disabled = true;
  sendButton.textContent = "Pensando…";

  const waiting = addMessage("Estoy preparando la respuesta…", "assistant");

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "No se pudo obtener la respuesta.");
    }

    waiting.textContent = data.answer || "No he recibido una respuesta.";
  } catch (error) {
    waiting.classList.add("error");
    waiting.textContent =
      "No he podido conectar con la IA. Comprueba la URL del servidor y vuelve a intentarlo.";
    console.error("Error del chat:", error);
  } finally {
    chatInput.disabled = false;
    sendButton.disabled = false;
    sendButton.textContent = "Enviar ↑";
    chatInput.focus();
  }
}

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question || chatInput.disabled) return;
  sendQuestion(question);
});

document.querySelectorAll("[data-question]").forEach(button => {
  button.addEventListener("click", () => {
    if (chatInput.disabled) return;
    chatInput.value = button.dataset.question;
    chatInput.focus();
  });
});
