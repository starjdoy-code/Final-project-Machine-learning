import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Header } from '@/sections/Header';
import { PredictionForm } from '@/sections/PredictionForm';
import { PredictionResult } from '@/sections/PredictionResult';
import { ModelMetrics } from '@/sections/ModelMetrics';
import { FeatureImportance } from '@/sections/FeatureImportance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, BarChart3, Zap } from 'lucide-react';
import type { PredictionInput, PredictionResponse } from '@/types';

function App() {
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const handlePredict = async (input: PredictionInput) => {
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      
      if (data.success) {
        setPredictionResult(data);
        toast.success(`Predicted Sales: $${Math.round(data.prediction).toLocaleString()}`, {
          description: `Using ${data.model_used === 'xgboost' ? 'XGBoost (Tuned)' : data.model_used === 'random_forest' ? 'Random Forest' : 'Linear Regression'}`,
        });
      } else {
        toast.error('Prediction failed', { description: data.error });
      }
    } catch (err) {
      toast.error('Network error', { 
        description: 'Please ensure the backend server is running on port 5000' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Top Section: Form + Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PredictionForm onPredict={handlePredict} loading={false} />
          {predictionResult && <PredictionResult result={predictionResult} />}
        </div>

        {/* Bottom Section: Metrics + Feature Importance */}
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 bg-white border">
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Model Performance
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Feature Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="metrics" className="mt-6">
            <ModelMetrics />
          </TabsContent>
          <TabsContent value="features" className="mt-6">
            <FeatureImportance />
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-medium text-slate-800">About This Project</p>
              <p>
                This application implements the research proposal for predicting retail store sales using
                Machine Learning regression algorithms. The models are trained on the Rossmann Store Sales
                dataset, which contains historical sales data from 1,115 stores across Europe.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-800 text-xs uppercase tracking-wider">Models</p>
                  <p className="text-slate-600">Linear Regression, Random Forest, XGBoost</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-800 text-xs uppercase tracking-wider">Evaluation</p>
                  <p className="text-slate-600">MAE, MSE, RMSE, R² Score</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-800 text-xs uppercase tracking-wider">Dataset</p>
                  <p className="text-slate-600">Rossmann Store Sales (Kaggle)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-slate-500 border-t border-slate-200">
          <p>Final Project Machine Learning - Kelas LM01 / Kelompok 1</p>
          <p className="mt-1">Louis Huang, Gilbert Tjandra Adanarianto, Dava Rabbani Adrian Widyatmoko</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
