from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Load models
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

lr_model = joblib.load(os.path.join(MODELS_DIR, 'linear_regression.pkl'))
rf_model = joblib.load(os.path.join(MODELS_DIR, 'random_forest.pkl'))
xgb_model = joblib.load(os.path.join(MODELS_DIR, 'xgboost_tuned.pkl'))
scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))

# Load feature importance
feature_importance = pd.read_csv(os.path.join(MODELS_DIR, 'feature_importance.csv'))

# Load model comparison
model_comparison = pd.read_csv(os.path.join(MODELS_DIR, 'model_comparison.csv'))

# Feature columns (must match training)
FEATURE_COLS = [
    'Store', 'DayOfWeek', 'Promo', 'SchoolHoliday',
    'CompetitionDistance', 'Month', 'Year', 'IsWeekend', 'IsHoliday',
    'StoreTypeEncoded', 'AssortmentEncoded'
]

# Store type and assortment mappings
STORE_TYPE_MAP = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
ASSORTMENT_MAP = {'a': 0, 'b': 1, 'c': 2}


@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract inputs
        store_type = data.get('store_type', 'a')
        assortment = data.get('assortment', 'a')
        promo = 1 if data.get('promo', False) else 0
        school_holiday = 1 if data.get('school_holiday', False) else 0
        competition_distance = float(data.get('competition_distance', 1000))
        date_str = data.get('date', '2015-07-31')
        state_holiday = data.get('state_holiday', '0')
        store_id = int(data.get('store_id', 1))
        model_name = data.get('model', 'xgboost')
        
        # Parse date
        date = pd.Timestamp(date_str)
        day_of_week = date.dayofweek + 1  # 1=Monday
        month = date.month
        year = date.year
        is_weekend = 1 if day_of_week >= 6 else 0
        is_holiday = 1 if state_holiday != '0' else 0
        
        # Encode categorical
        store_type_enc = STORE_TYPE_MAP.get(store_type, 0)
        assortment_enc = ASSORTMENT_MAP.get(assortment, 0)
        
        # Build feature vector
        features = np.array([[
            store_id, day_of_week, promo, school_holiday,
            competition_distance, month, year, is_weekend, is_holiday,
            store_type_enc, assortment_enc
        ]])
        
        # Select model
        if model_name == 'linear':
            features_scaled = scaler.transform(features)
            prediction = lr_model.predict(features_scaled)[0]
        elif model_name == 'random_forest':
            prediction = rf_model.predict(features)[0]
        else:  # xgboost (default)
            prediction = xgb_model.predict(features)[0]
        
        # Ensure non-negative
        prediction = max(0, float(prediction))
        
        # Feature contributions (simplified)
        contributions = {
            'Promo': 0.25 if promo else 0,
            'Store Type': 0.15,
            'Day of Week': 0.12 if not is_weekend else 0.05,
            'Assortment': 0.12,
            'Holiday': -0.10 if is_holiday else 0,
            'Season': 0.08,
            'Competition': -0.05 if competition_distance < 1000 else 0,
            'Other': 0.08
        }
        
        return jsonify({
            'success': True,
            'prediction': round(prediction, 2),
            'model_used': model_name,
            'input_summary': {
                'store_type': store_type,
                'assortment': assortment,
                'promo': bool(promo),
                'date': date_str,
                'day_of_week': day_of_week,
                'is_weekend': bool(is_weekend),
                'is_holiday': bool(is_holiday),
                'school_holiday': bool(school_holiday),
                'competition_distance': competition_distance
            },
            'contributions': contributions
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/models', methods=['GET'])
def get_models():
    return jsonify({
        'success': True,
        'models': [
            {'id': 'linear', 'name': 'Linear Regression', 'type': 'Baseline'},
            {'id': 'random_forest', 'name': 'Random Forest', 'type': 'Main'},
            {'id': 'xgboost', 'name': 'XGBoost (Tuned)', 'type': 'Best'}
        ]
    })


@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    return jsonify({
        'success': True,
        'metrics': model_comparison.to_dict('records'),
        'targets': {
            'mae_target': '< 15%',
            'rmse_target': '< 15%',
            'r2_target': '> 0.85'
        }
    })


@app.route('/api/feature-importance', methods=['GET'])
def get_feature_importance():
    return jsonify({
        'success': True,
        'features': feature_importance.to_dict('records')
    })


@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    try:
        data = request.get_json()
        records = data.get('records', [])
        model_name = data.get('model', 'xgboost')
        
        results = []
        for record in records:
            store_type = record.get('store_type', 'a')
            assortment = record.get('assortment', 'a')
            promo = 1 if record.get('promo', False) else 0
            school_holiday = 1 if record.get('school_holiday', False) else 0
            competition_distance = float(record.get('competition_distance', 1000))
            date_str = record.get('date', '2015-07-31')
            state_holiday = record.get('state_holiday', '0')
            store_id = int(record.get('store_id', 1))
            
            date = pd.Timestamp(date_str)
            day_of_week = date.dayofweek + 1
            month = date.month
            year = date.year
            is_weekend = 1 if day_of_week >= 6 else 0
            is_holiday = 1 if state_holiday != '0' else 0
            
            store_type_enc = STORE_TYPE_MAP.get(store_type, 0)
            assortment_enc = ASSORTMENT_MAP.get(assortment, 0)
            
            features = np.array([[
                store_id, day_of_week, promo, school_holiday,
                competition_distance, month, year, is_weekend, is_holiday,
                store_type_enc, assortment_enc
            ]])
            
            if model_name == 'linear':
                features_scaled = scaler.transform(features)
                pred = lr_model.predict(features_scaled)[0]
            elif model_name == 'random_forest':
                pred = rf_model.predict(features)[0]
            else:
                pred = xgb_model.predict(features)[0]
            
            results.append({
                'input': record,
                'prediction': round(max(0, float(pred)), 2)
            })
        
        return jsonify({
            'success': True,
            'model_used': model_name,
            'results': results
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)
