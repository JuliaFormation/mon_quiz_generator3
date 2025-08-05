const questionDiv = document.getElementById("question");
const answersDiv = document.getElementById("answers");
const validateBtn = document.getElementById("validate-btn");
const backBtn = document.getElementById("back-btn");
const resultDiv = document.getElementById("result");
const quizName = document.getElementById("quizName");

let questions = JSON.parse(localStorage.getItem("questions")) || [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

quizName.textContent = localStorage.getItem("quizName") || "Quiz";

function displayQuestion() {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex];
        questionDiv.innerHTML = q.question; // Affichage de la question
        answersDiv.innerHTML = "";
        resultDiv.style.display = "none"; // Cacher resultDiv pendant le quiz
        resultDiv.innerHTML = ""; // Vider resultDiv
        answersDiv.style.display = "flex";
        answersDiv.style.flexWrap = "wrap";
        answersDiv.style.justifyContent = "center"; // Centrage général
        q.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.onclick = () => selectAnswer(answer);
            answersDiv.appendChild(button);
            // Ajuster la taille selon le nombre de choix
            if (q.answers.length === 3) {
                button.style.flex = "1 1 calc(30% - 20px)"; // Même taille pour 3 choix
                button.style.margin = "5px";
            } else if (q.answers.length === 2) {
                button.style.flex = "1 1 calc(45% - 10px)"; // Comme avant pour 2 choix
                button.style.margin = "5px";
            } else {
                button.style.flex = "1 1 calc(22% - 10px)"; // Pour 4 choix
                button.style.margin = "5px";
            }
        });
        validateBtn.disabled = false;
        backBtn.disabled = currentQuestionIndex === 0;
    } else {
        showResult();
    }
}

function selectAnswer(selectedAnswer) {
    userAnswers[currentQuestionIndex] = selectedAnswer;
    const buttons = answersDiv.getElementsByTagName("button");
    for (let btn of buttons) {
        btn.style.backgroundColor = (btn.textContent === selectedAnswer) ? "#90EE90" : "";
        btn.disabled = false;
    }
    validateBtn.disabled = false;
}

function checkAnswer() {
    const q = questions[currentQuestionIndex];
    const selectedAnswer = userAnswers[currentQuestionIndex];
    if (selectedAnswer === q.correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    displayQuestion();
}

function goBack() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function showResult() {
    resultDiv.innerHTML = ``; // Vider d'abord
    resultDiv.style.display = "block"; // Réactiver l'affichage du résultat
    const endMessageInput = localStorage.getItem("endMessage") || "score>0:Bravo!;else:Essaie encore!";
    let finalMessage = "";
    if (endMessageInput.includes("score")) {
        const [conditionPart, elsePart] = endMessageInput.split(";else:");
        const [condition, trueMessage] = conditionPart.split(":");
        const threshold = parseInt(condition.replace("score>", ""));
        finalMessage = (score > threshold) ? trueMessage : elsePart;
    } else {
        finalMessage = endMessageInput;
    }
    // Affichage hors cadre
    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "scoreDisplay";
    scoreDisplay.innerHTML = `Score : ${score} / ${questions.length}`;
    document.querySelector(".container").insertBefore(scoreDisplay, resultDiv);
    const messageDisplay = document.createElement("div");
    messageDisplay.id = "messageDisplay";
    messageDisplay.innerHTML = finalMessage.includes("http") ? `<a href="${finalMessage}" target="_blank">${finalMessage}</a>` : finalMessage;
    document.querySelector(".container").insertBefore(messageDisplay, resultDiv);

    // Affichage de toutes les questions et réponses dans le cadre
    questions.forEach((q, index) => {
        resultDiv.innerHTML += `<strong>${q.question}</strong><br>`;
        q.answers.forEach(answer => {
            let style = "";
            if (answer === q.correctAnswer) style = "color: green;";
            else if (userAnswers[index] === answer && answer !== q.correctAnswer) style = "color: red; text-decoration: line-through;";
            else style = "color: black; text-decoration: line-through;";
            resultDiv.innerHTML += `<span style="${style}">${answer}</span><br>`;
        });
        resultDiv.innerHTML += "<br>";
    });

    questionDiv.innerHTML = "";
    answersDiv.innerHTML = "";
    validateBtn.style.display = "none"; // Cacher Valider
    backBtn.style.display = "none"; // Cacher Retour
    const restartBtn = document.createElement("button");
    restartBtn.id = "restartBtn";
    restartBtn.textContent = "Recommencer le quiz";
    restartBtn.onclick = () => {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        validateBtn.style.display = "inline-block";
        backBtn.style.display = "inline-block";
        restartBtn.remove();
        scoreDisplay.remove();
        messageDisplay.remove();
        resultDiv.innerHTML = "";
        resultDiv.style.display = "none"; // Cacher resultDiv pour repartir
        displayQuestion();
    };
    document.querySelector(".container").appendChild(restartBtn);
}

validateBtn.addEventListener("click", checkAnswer);
backBtn.addEventListener("click", goBack);
displayQuestion();