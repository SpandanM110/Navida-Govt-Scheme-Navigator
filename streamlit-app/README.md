# Navida Streamlit App

**Exa-first flow:** User enters profile → Exa searches the web → Groq generates personalized guidance.

No static scheme database – results come from live web search via Exa, synthesized by Groq LLM.

## Setup (Recommended: Use venv)

### Option 1: Run script (easiest)

**Windows:**
```cmd
cd streamlit-app
run.bat
```
Or PowerShell: `.\run.ps1`

**Mac/Linux:**
```bash
cd streamlit-app
chmod +x run.sh
./run.sh
```

The script creates a `.venv` folder, installs dependencies, and runs Streamlit.

### Option 2: Manual venv setup

```bash
cd streamlit-app

# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Activate (Windows CMD)
.venv\Scripts\activate.bat

# Activate (Mac/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy .env.example to .env and add your API keys
# EXA_API_KEY (from https://dashboard.exa.ai/)
# GROQ_API_KEY (from https://console.groq.com/keys)

# Run
streamlit run app.py
```

## API Keys

Copy `.env.example` to `.env` and add:

- **EXA_API_KEY** – [Exa Dashboard](https://dashboard.exa.ai/)
- **GROQ_API_KEY** – [Groq Console](https://console.groq.com/keys)

You can also add keys to the project root `.env` file.

## How it works

1. **User input** – Age, income, gender, state, occupation, category
2. **Exa search** – Dynamic query built from profile → searches web for relevant Indian govt schemes
3. **Groq guidance** – Synthesizes Exa results into personalized, actionable guidance

## Integrations

- **Exa Web Search** – Searches the web for schemes matching user profile
- **Groq LLM** – Generates personalized guidance from search results
