# Stock & Mutual Fund Analysis App

A modern application for analyzing Stocks and Mutual Funds using React (Frontend) and FastAPI (Backend), powered by AI (OpenAI/Groq).

## Prerequisites

- **Python 3.8+**: Ensure Python is installed and added to PATH.
- **Node.js 18+**: Required for the React Frontend. [Download here](https://nodejs.org/).

## Setup Instructions

### 1. Backend Setup

The backend handles API requests, stock data fetching (yfinance), and AI analysis.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    - Windows: `.\venv\Scripts\activate`
    - Mac/Linux: `source venv/bin/activate`
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Set up Environment Variables:
    - Create a `.env` file in `backend/`
    - Add your keys:
      ```env
      OPENAI_API_KEY=your_openai_key
      GROQ_API_KEY=your_groq_key
      ```
6.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    API will be available at `http://localhost:8000`. Documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    App will be running at `http://localhost:5173`.

## Features
- Stock Search & History Charts
- AI-Generated Stock Analysis
- Mutual Fund details (Coming Soon)
