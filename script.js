const questions = [
  {
    category: "THE BASICS",
    prompt: "What does the term “artificial intelligence” describe?",
    choices: ["Computers designed to do tasks that typically need human intelligence", "Any computer that connects to the internet", "A machine that can think exactly like a person", "A database that stores information automatically"],
    answer: 0,
    explanation: "AI is a broad field focused on building systems that can perform tasks like recognizing patterns, understanding language, or making predictions."
  },
  {
    category: "HOW IT LEARNS",
    prompt: "In machine learning, what is a model?",
    choices: ["A physical robot prototype", "A system trained to find patterns and make predictions", "A list of rules written for every possible situation", "A screen that displays training data"],
    answer: 1,
    explanation: "A model is the learned system produced by training. It applies patterns from examples to new inputs."
  },
  {
    category: "TRAINING DATA",
    prompt: "Why does the quality of training data matter?",
    choices: ["More data always makes a model fairer", "It determines how quickly a computer turns on", "A model can reflect gaps and biases in its examples", "It removes the need to test a model"],
    answer: 2,
    explanation: "Models learn from examples. Missing, skewed, or inaccurate data can lead to unreliable results."
  },
  {
    category: "LANGUAGE MODELS",
    prompt: "How does a large language model usually generate text?",
    choices: ["By looking up every sentence in a fixed encyclopedia", "By translating a hidden human script", "By choosing words at random", "By predicting likely next tokens from context"],
    answer: 3,
    explanation: "A language model generates text one token at a time, estimating what is likely to come next given the context."
  },
  {
    category: "GENERATIVE AI",
    prompt: "What makes generative AI different from many other AI systems?",
    choices: ["It can create new content such as text, images, or audio", "It can only sort information into categories", "It does not need examples to learn", "It always checks whether its answers are true"],
    answer: 0,
    explanation: "Generative models produce new material, though fluent or convincing output is not necessarily accurate."
  },
  {
    category: "A USEFUL TERM",
    prompt: "What is an “AI hallucination”?",
    choices: ["A computer displaying a blank screen", "A confident-sounding AI answer that is false or made up", "A model learning from too many images", "A robot mistaking a reflection for a person"],
    answer: 1,
    explanation: "The term describes generated output that sounds plausible but includes incorrect or invented information."
  },
  {
    category: "NEURAL NETWORKS",
    prompt: "What is a neural network loosely inspired by?",
    choices: ["The structure of a search engine", "A set of if-then instructions", "Connected neurons in the brain", "The layout of computer memory"],
    answer: 2,
    explanation: "Artificial neural networks take loose inspiration from connected neurons, but they are mathematical systems, not digital brains."
  },
  {
    category: "PROMPTING",
    prompt: "Which prompt is most likely to get a useful, focused response?",
    choices: ["Tell me everything", "Do the thing from before", "Make it better, somehow", "Summarize this article in three bullet points for a new reader"],
    answer: 3,
    explanation: "A clear goal, useful context, and a specific format help the model aim at what you actually need."
  },
  {
    category: "RESPONSIBLE USE",
    prompt: "Before sharing sensitive personal information with an AI tool, what should you do?",
    choices: ["Check the tool’s privacy policy and avoid sharing what isn’t necessary", "Share it only if you ask in a polite tone", "Convert it into a longer prompt first", "Assume it disappears when you close the tab"],
    answer: 0,
    explanation: "Data practices differ between tools. Check their policies, and share only what is necessary and appropriate."
  },
  {
    category: "THE BIG PICTURE",
    prompt: "What is a sensible way to use an AI-generated answer?",
    choices: ["Treat it as correct if it sounds confident", "Use it as a starting point and verify important claims", "Assume it has checked the latest sources", "Trust it more than a qualified expert"],
    answer: 1,
    explanation: "AI can be useful, but it can make mistakes. Verify consequential information with reliable sources or experts."
  }
];

const questionCount = document.querySelector("#question-count");
const scoreCount = document.querySelector("#score-count");
const progressTrack = document.querySelector(".progress-track");
const progressFill = document.querySelector(".progress-fill");
const questionCategory = document.querySelector("#question-category");
const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const feedback = document.querySelector("#feedback");
const feedbackText = document.querySelector("#feedback-text");
const nextButton = document.querySelector("#next-button");
const nextLabel = document.querySelector("#next-label");
const questionCard = document.querySelector(".question-card");
const questionContent = document.querySelector(".question-content");
const cardFooter = document.querySelector(".card-footer");

let currentQuestion = 0;
let score = 0;
let hasAnswered = false;

function renderQuestion() {
  const question = questions[currentQuestion];
  questionCount.textContent = String(currentQuestion + 1).padStart(2, "0");
  scoreCount.textContent = String(score).padStart(2, "0");
  questionCategory.textContent = question.category;
  questionText.textContent = question.prompt;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(currentQuestion + 1));
  answerList.replaceChildren();
  feedback.hidden = true;
  feedback.classList.remove("is-wrong");
  nextButton.disabled = true;
  nextLabel.textContent = "CHOOSE AN ANSWER";
  hasAnswered = false;

  question.choices.forEach((choice, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "answer-option";
    option.innerHTML = `<span class="answer-key">${String.fromCharCode(65 + index)}</span><span class="answer-text"></span>`;
    option.querySelector(".answer-text").textContent = choice;
    option.addEventListener("click", () => selectAnswer(index));
    answerList.append(option);
  });

  questionCard.classList.remove("arrive");
  void questionCard.offsetWidth;
  questionCard.style.animation = "none";
  requestAnimationFrame(() => { questionCard.style.animation = ""; });
}

function selectAnswer(selectedIndex) {
  if (hasAnswered) return;
  hasAnswered = true;
  const question = questions[currentQuestion];
  const options = [...answerList.querySelectorAll(".answer-option")];
  const isCorrect = selectedIndex === question.answer;

  options.forEach((option, index) => {
    option.disabled = true;
    if (index === question.answer) option.classList.add("is-correct");
    else if (index === selectedIndex) option.classList.add("is-wrong");
  });

  if (isCorrect) score += 1;
  scoreCount.textContent = String(score).padStart(2, "0");
  feedback.classList.toggle("is-wrong", !isCorrect);
  feedbackText.textContent = `${isCorrect ? "That’s right." : "Not quite."} ${question.explanation}`;
  feedback.hidden = false;
  nextButton.disabled = false;
  nextLabel.textContent = currentQuestion === questions.length - 1 ? "SEE YOUR RESULTS" : "NEXT QUESTION";
}

function renderResults() {
  progressFill.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", String(questions.length));
  questionCount.textContent = "10";
  questionCard.classList.add("result-card");
  questionContent.hidden = true;
  cardFooter.hidden = true;

  const heading = score === questions.length ? "A brilliant mind." : score >= 7 ? "Nicely reasoned." : score >= 4 ? "Curiosity looks good on you." : "Every expert starts somewhere.";
  const detail = score === questions.length
    ? "A perfect run. Keep asking the thoughtful questions."
    : score >= 7
      ? "You have a sharp feel for how AI works. Keep questioning the answers, too."
      : score >= 4
        ? "You’ve got a good start. There’s always another layer to explore."
        : "That’s ten new ideas to take with you. Try another round and see what sticks.";

  const resultView = document.createElement("div");
  resultView.className = "result-view";
  resultView.innerHTML = `<div class="result-seal" aria-hidden="true">✳</div><p class="result-eyebrow">FIELDNOTES COMPLETE</p><h2>${heading}</h2><div class="result-score">${score}<span> / 10</span></div><p class="result-message">${detail}</p><button class="restart-button" type="button">TAKE THE QUIZ AGAIN <span aria-hidden="true">↗</span></button>`;
  questionCard.append(resultView);
  resultView.querySelector(".restart-button").addEventListener("click", restartQuiz);
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  questionCard.querySelector(".result-view").remove();
  questionCard.classList.remove("result-card");
  questionContent.hidden = false;
  cardFooter.hidden = false;
  renderQuestion();
}

nextButton.addEventListener("click", () => {
  if (!hasAnswered) return;
  if (currentQuestion === questions.length - 1) {
    renderResults();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
});

renderQuestion();