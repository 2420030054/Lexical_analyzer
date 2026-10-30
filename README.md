
# LEXORA – Lexical Analyzer

A web-based lexical analyzer for a simple programming language, developed using FLEX and Python Flask.

## Features
- Identifies keywords
- Identifies identifiers
- Detects operators
- Recognizes numeric constants
- Identifies special symbols
- Detects invalid tokens
- Displays token counts and line numbers
- Provides a web-based interface for code analysis

## Technologies Used
- FLEX
- C
- Python
- Flask
- HTML
- CSS
- JavaScript

## Project Structure

```text
LEXORA/
├── backend/
│   ├── app.py
│   ├── templates/
│   │   └── index.html
│   └── static/
│       ├── style.css
│       └── script.js
├── lexer.l
├── input.c
├── requirements.txt
├── README.md
└── .gitignore
```

## Requirements

- Python 3
- FLEX
- GCC or a compatible C compiler
- Flask

## Installation and Execution

### 1. Install Flask

```bash
pip install -r requirements.txt
```

### 2. Compile the FLEX program

```bash
flex lexer.l
gcc lex.yy.c -o lexer
```

### 3. Start the Flask application

```bash
python backend/app.py
```

### 4. Open the application

Visit:

http://127.0.0.1:5000

Paste your C source code and click **ANALYZE CODE** to view the tokens and statistics.

## Project Objective

To develop a lexical analyzer that scans source code, identifies different token categories, and displays the results through a simple web interface.
