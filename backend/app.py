
from flask import Flask, render_template, request, jsonify
import subprocess
from pathlib import Path

app = Flask(__name__)

PROJECT_DIR = Path(__file__).resolve().parent.parent
LEXER_PATH = PROJECT_DIR / "lexer"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    source_code = data.get("code", "")

    if not source_code.strip():
        return jsonify({"error": "Please enter some code."}), 400

    try:
        result = subprocess.run(
            [str(LEXER_PATH)],
            input=source_code,
            capture_output=True,
            text=True,
            cwd=PROJECT_DIR,
            timeout=5
        )

        if result.returncode != 0:
            return jsonify({
                "error": result.stderr or "Lexer execution failed."
            }), 500

        tokens = []

        for line in result.stdout.splitlines():
            parts = line.split("\t")

            if len(parts) == 3:
                lexeme, token_type, line_number = parts

                tokens.append({
                    "lexeme": lexeme,
                    "type": token_type,
                    "line": int(line_number)
                })

        stats = {
            "total": len(tokens),
            "keywords": 0,
            "identifiers": 0,
            "operators": 0,
            "numbers": 0,
            "special": 0,
            "invalid": 0
        }

        for token in tokens:
            token_type = token["type"]

            if token_type == "KEYWORD":
                stats["keywords"] += 1
            elif token_type == "IDENTIFIER":
                stats["identifiers"] += 1
            elif token_type == "OPERATOR":
                stats["operators"] += 1
            elif token_type == "NUMBER":
                stats["numbers"] += 1
            elif token_type == "SPECIAL SYMBOL":
                stats["special"] += 1
            elif token_type == "INVALID TOKEN":
                stats["invalid"] += 1

        return jsonify({
            "tokens": tokens,
            "stats": stats
        })

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Lexer execution timed out."}), 408

    except FileNotFoundError:
        return jsonify({
            "error": "Lexer executable not found. Compile lexer.l first."
        }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
