#!/bin/bash
# Install Python dependencies
pip install -q flask flask-cors numpy pandas scikit-learn xgboost joblib

# Start the Flask server
python backend/server.py
