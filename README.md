# Retail Store Sales Predictor - ML Final Project

## Overview
Machine Learning-powered web application for predicting retail store sales based on promotions, holidays, and operational factors. Built with Linear Regression, Random Forest, and XGBoost algorithms trained on the Rossmann Store Sales dataset.

## Team Members
- Louis Huang - 2802449373
- Gilbert Tjandra Adanarianto - 2802450450
- Dava Rabbani Adrian Widyatmoko - 2702341902

## Features
- **Interactive Prediction Form**: Configure store parameters (type, assortment, promo, holidays, competition distance, date)
- **Model Selection**: Choose between Linear Regression (baseline), Random Forest (main), or XGBoost (best/tuned)
- **Prediction Results**: View predicted daily sales with input summary and impact factor analysis
- **Model Performance Comparison**: Compare MAE, MSE, RMSE, and R² across all models
- **Feature Importance Analysis**: Visualize which factors most influence sales predictions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Flask (Python) + CORS
- **ML Models**: scikit-learn (Linear Regression, Random Forest), XGBoost
- **Dataset**: Rossmann Store Sales (Kaggle)

## Project Structure
```
app/
├── backend/              # Flask API server
│   ├── server.py         # Main server (serves API + static files)
│   ├── app.py            # API-only server
│   └── requirements.txt  # Python dependencies
├── models/               # Trained ML models
│   ├── linear_regression.pkl
│   ├── random_forest.pkl
│   ├── xgboost_tuned.pkl
│   ├── scaler.pkl
│   ├── feature_importance.csv
│   └── model_comparison.csv
├── src/                  # React frontend source
│   ├── sections/         # Page sections
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   └── App.tsx           # Main app component
├── dist/                 # Built frontend files
└── start.sh              # Quick start script
```

## Quick Start

### Option 1: Run with start script
```bash
# Make sure you have Python 3.9+ and Node.js installed
bash start.sh
```

### Option 2: Manual setup

#### 1. Install Python dependencies
```bash
pip install flask flask-cors numpy pandas scikit-learn xgboost joblib
```

#### 2. Start the Flask server
```bash
python backend/server.py
```
The server will start on `http://localhost:5000`

#### 3. Access the application
Open your browser and navigate to `http://localhost:5000`

### Option 3: Development mode

#### Start the Flask backend
```bash
python backend/server.py
```

#### In a separate terminal, start the React dev server
```bash
npm run dev
```

The frontend will be on `http://localhost:5173` and the backend on `http://localhost:5000`

## ML Model Results

| Model | MAE | RMSE | R² Score |
|-------|-----|------|----------|
| Linear Regression | 1,179 | 1,628 | 55.8% |
| Random Forest | 605 | 802 | 89.3% |
| XGBoost | 567 | 747 | 90.7% |
| **XGBoost (Tuned)** | **556** | **733** | **91.1%** |

### Evaluation Targets (Achieved)
- MAE < 15%: **Achieved** (8.4%)
- RMSE < 15%: **Achieved** (11.3%)
- R² > 0.85: **Achieved** (0.91)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict` | POST | Get sales prediction |
| `/api/models` | GET | List available models |
| `/api/metrics` | GET | Get model performance metrics |
| `/api/feature-importance` | GET | Get feature importance data |

### Prediction Request Body
```json
{
  "store_type": "a",
  "assortment": "c",
  "promo": true,
  "school_holiday": false,
  "competition_distance": 1500,
  "date": "2015-07-31",
  "state_holiday": "0",
  "store_id": 1,
  "model": "xgboost"
}
```

## Feature Importance (Top 5)
1. **Promotion** (24.6%) - Active promotional campaigns
2. **Store Type** (22.3%) - Store format/category
3. **Day of Week** (16.5%) - Weekday patterns
4. **Assortment** (15.0%) - Product range level
5. **Holiday Effect** (11.8%) - Public holidays impact
