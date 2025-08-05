const csvFileInput = document.getElementById("csvFile");
const loadBtn = document.getElementById("loadBtn");
const startQuizBtn = document.getElementById("startQuizBtn");
const endMessageInput = document.getElementById("endMessage");

csvFileInput.addEventListener("change", function() {
    loadBtn.disabled = !this.files.length;
});

loadBtn.addEventListener("click", function() {
    const file = csvFileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            const rows = data.split("\n").slice(1);
            let questions = [];
            rows.forEach(row => {
                const cols = row.split(";");
                if (cols.length > 1) {
                    const question = cols[0];
                    const answers = [cols[1], cols[2], cols[3], cols[4]].filter(a => a);
                    const correctAnswer = cols[5].trim();
                    questions.push({ question, answers, correctAnswer });
                }
            });
            const quizName = file.name.replace(".csv", "");
            localStorage.setItem("questions", JSON.stringify(questions));
            localStorage.setItem("quizName", quizName);
            localStorage.setItem("endMessage", endMessageInput.value || "score>0:Bravo!;else:Essaie encore!");
            window.location.href = "loading.html";
        };
        reader.readAsText(file);
    }
});