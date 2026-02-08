# Stock Analysis Project

This project predicts stock price movements using technical indicators and a Random Forest classifier.

## Project Structure
```
d:/Stock_Analysis/
├── config.py           # Configuration parameters
├── data/
│   ├── __init__.py
│   └── loader.py       # Data fetching
├── features/
│   ├── __init__.py
│   └── indicators.py   # Feature engineering
├── models/
│   ├── __init__.py
│   └── train.py        # Model training
├── main.py             # Main entry point
└── requirements.txt    # Dependencies
```

## Setup & Usage

1.  Isntall dependencies:
    ```bash
    pip install -r requirements.txt
    ```

2.  Run the analysis:
    ```bash
    python main.py
    ```

## Configuration
Modify `config.py` to change the ticker, start date, or model parameters.
