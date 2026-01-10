# 🧭 Navida – Government Scheme Navigator

Navida is an **AI-powered platform** designed to help Indian citizens **discover, understand, and access government welfare schemes** without confusion, language barriers, or dependency on intermediaries.

The system combines a **modern React frontend**, a **deterministic eligibility engine**, and **open-source LLMs** to deliver accurate, explainable, and accessible guidance.

## 🎯 Problem Statement

Millions of eligible citizens miss out on government benefits due to:
- Complex eligibility criteria written in bureaucratic language
- Low awareness of available schemes
- Language barriers across diverse populations
- Dependence on intermediaries or agents

Navida addresses this by providing **direct, transparent, and multilingual access** to welfare information.

## 🏗️ System Architecture (High-Level)

Navida follows a **layered, hybrid architecture**:

```

User
↓
React Frontend (Vite + TypeScript + Tailwind + shadcn/ui)
↓
Eligibility Logic (Python – deterministic rules engine)
↓
AI Layer (Open-source LLMs for explanation & translation)
↓
Supabase (data, auth, future persistence)

```

## 🧩 Why Two Frontends? (Important Design Choice)

Navida intentionally separates **AI logic prototyping** from **production UI**.

### 🔹 React Frontend (Production Layer)
- Built with **Vite + React + TypeScript**
- Styled using **Tailwind CSS & shadcn/ui**
- Deployed on **Vercel**
- Designed for scalability, accessibility, and real-world usage

### 🔹 Streamlit App (AI & Logic Prototype Layer)
- Used for **rapid development and validation** of:
  - Eligibility rules
  - LLM-based explanations
  - Multilingual support
- Acts as an **internal AI interaction layer**
- Enables fast iteration before backend/API integration

> Streamlit is **not** the end-user product — it is a **research & validation layer** that ensures correctness and responsible AI usage.

## 📁 Repository Structure

```

navida-accessible-benefits-navigator/
│
├── frontend/                    # React + TypeScript application
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
│
├── ai_logic_layer/              # Streamlit AI prototype
│   ├── app.py
│   ├── eligibility_engine.py
│   ├── schemes_data.py
│   ├── llm_utils.py
│   └── requirements.txt
│
├── README.md
└── .env.example

````

## 🧠 Eligibility & AI Design Principles

### ✅ Deterministic Eligibility
- All eligibility decisions are **rule-based**
- No LLM involvement in qualification logic
- Fully transparent and auditable

### 🤖 Responsible Use of Open LLMs
Open-source LLMs (e.g., Gemma, Qwen) are used **only for**:
- Simplifying scheme explanations
- Translating content into Indian languages
- Conversational guidance

This avoids hallucinations and ensures trust.

## ⚙️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### AI & Logic Layer
- Python
- Streamlit
- Rule-based eligibility engine
- Open-source LLMs (optional/pluggable)

### Backend / Platform
- Supabase (auth, database, future storage)
- Environment-based configuration

## 🚀 Getting Started

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
````

### AI Logic Layer (Streamlit)

```bash
cd ai_logic_layer
pip install -r requirements.txt
streamlit run app.py
```

## 🧪 How Navida Works (End-to-End)

1. User enters personal details via the React UI
2. Eligibility rules are evaluated deterministically
3. Matching schemes are identified
4. Open LLMs generate:

   * Simple explanations
   * Multilingual guidance
5. Results are displayed clearly — no middlemen, no ambiguity

## 📈 Expected Impact

* ⚡ Reduce scheme discovery time from days to minutes
* 📢 Increase awareness of welfare programs
* ❌ Eliminate dependency on intermediaries
* 🌍 Enable inclusive access across languages and regions

## 🔮 Future Roadmap

* Convert eligithe bility engine into FastAPI microservices
* RAG-based retrieval from official government PDFs
* Direct application submission & document uploads
* Life-event-based eligibility notifications
* Expansion to state-level schemes and languages

## 🎤 One-Line Summary

> Navida combines deterministic eligibility logic with open-source LLM-powered accessibility, using Streamlit for AI prototyping and React for scalable public deployment.

## 📜 License

Developed for educational, research, and public-good use.

## 🙌 Vision

The goal isn’t just better technology —
it’s **better governance and equitable access to opportunity**.
