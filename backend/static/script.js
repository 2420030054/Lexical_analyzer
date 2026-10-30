
console.log("LEXORA JavaScript Loaded");

const editor = document.getElementById("sourceCode");
const lineNumbers = document.getElementById("lineNumbers");
const analyzeBtn = document.getElementById("analyzeBtn");

// LINE NUMBERS

function updateLineNumbers() {
    const lines = editor.value.split("\n").length;

    lineNumbers.innerHTML = Array.from(
        { length: lines },
        (_, i) => i + 1
    ).join("<br>");

    lineNumbers.scrollTop = editor.scrollTop;
}

editor.addEventListener("input", updateLineNumbers);

editor.addEventListener("scroll", () => {
    lineNumbers.scrollTop = editor.scrollTop;
});

updateLineNumbers();


// ANALYZE BUTTON

analyzeBtn.addEventListener("click", async () => {

    console.log("ANALYZE BUTTON CLICKED");

    const sourceCode = editor.value;

    if (!sourceCode.trim()) {
        alert("Please enter source code!");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "ANALYZING...";

    try {

        const response = await fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: sourceCode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed");
        }

        console.log("Scanner results:", data);

        // STATISTICS

        document.getElementById("totalTokens").textContent =
            data.stats.total;

        document.getElementById("keywords").textContent =
            data.stats.keywords;

        document.getElementById("identifiers").textContent =
            data.stats.identifiers;

        document.getElementById("operators").textContent =
            data.stats.operators;

        document.getElementById("numbers").textContent =
            data.stats.numbers;

        document.getElementById("specialSymbols").textContent =
            data.stats.special;

        document.getElementById("invalidTokens").textContent =
            data.stats.invalid;


        // TOKEN TABLE

        const table = document.getElementById("tokenTable");
        table.replaceChildren();

        data.tokens.forEach((token, index) => {

            const row = document.createElement("tr");

            const values = [
                index + 1,
                token.lexeme,
                token.type,
                token.line
            ];

            values.forEach((value, i) => {

                const cell = document.createElement("td");

                if (i === 2) {

                    const badge = document.createElement("span");

                    badge.textContent = value;
                    badge.className = "token-badge";

                    const classes = {
                        "KEYWORD": "token-keyword",
                        "IDENTIFIER": "token-identifier",
                        "OPERATOR": "token-operator",
                        "NUMBER": "token-number",
                        "SPECIAL SYMBOL": "token-special",
                        "INVALID TOKEN": "token-invalid"
                    };

                    badge.classList.add(
                        classes[value] || "token-special"
                    );

                    cell.appendChild(badge);

                } else {
                    cell.textContent = value;
                }

                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        if (data.tokens.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.className = "empty-state";
            cell.textContent = "No tokens found.";

            row.appendChild(cell);
            table.appendChild(row);
        }

        document.getElementById("resultStatus").textContent =
            data.stats.invalid > 0
                ? "ANALYSIS COMPLETED // ERRORS FOUND"
                : "ANALYSIS COMPLETED // SUCCESS";

    } catch (error) {

        console.error(error);
        alert(error.message);

        document.getElementById("resultStatus").textContent =
            "ANALYSIS FAILED";

    } finally {

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML =
            "<span>▶</span> ANALYZE CODE <span>→</span>";
    }
});
