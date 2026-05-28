export interface PredictionInput {
  store_type: string;
  assortment: string;
  promo: boolean;
  school_holiday: boolean;
  competition_distance: number;
  date: string;
  state_holiday: string;
  store_id: number;
  model: string;
}

export interface PredictionResponse {
  success: boolean;
  prediction: number;
  model_used: string;
  input_summary: {
    store_type: string;
    assortment: string;
    promo: boolean;
    date: string;
    day_of_week: number;
    is_weekend: boolean;
    is_holiday: boolean;
    school_holiday: boolean;
    competition_distance: number;
  };
  contributions: Record<string, number>;
  error?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  type: string;
}

export interface ModelMetrics {
  Model: string;
  MAE: number;
  MSE: number;
  RMSE: number;
  R2: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}
