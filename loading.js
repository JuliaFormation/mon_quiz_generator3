const quizName = document.getElementById("quizName");
const testBtn = document.getElementById("testBtn");
const shareBtn = document.getElementById("shareBtn");

quizName.textContent = localStorage.getItem("quizName") || "Quiz";
testBtn.addEventListener("click", () => {
    window.location.href = "quiz.html";
});
shareBtn.addEventListener("click", () => {
    alert("Partage en cours... (à implémenter plus tard)");
});