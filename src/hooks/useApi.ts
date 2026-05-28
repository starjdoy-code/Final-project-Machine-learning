import { useState, useCallback } from 'react';
import type { PredictionInput, PredictionResponse, ModelInfo, ModelMetrics, FeatureImportance } from '@/types';

const API_BASE = '/api';

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (input: PredictionInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { predict, loading, result, error };
}

export async function fetchModels(): Promise<ModelInfo[]> {
  const response = await fetch(`${API_BASE}/models`);
  const data = await response.json();
  return data.models || [];
}

export async function fetchMetrics(): Promise<ModelMetrics[]> {
  const response = await fetch(`${API_BASE}/metrics`);
  const data = await response.json();
  return data.metrics || [];
}

export async function fetchFeatureImportance(): Promise<FeatureImportance[]> {
  const response = await fetch(`${API_BASE}/feature-importance`);
  const data = await response.json();
  return data.features || [];
}
