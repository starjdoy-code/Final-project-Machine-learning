import { Store, TrendingUp, Brain, GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Store className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30">
                <Brain className="w-3 h-3 mr-1" />
                ML Project
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Regression
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Retail Store Sales Predictor
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
              Machine Learning-powered sales forecasting based on promotions, holidays, and operational factors.
              Built with Linear Regression, Random Forest, and XGBoost algorithms.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <GitBranch className="w-4 h-4" />
              <span>Rossmann Store Sales Dataset</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                XGBoost R²: 91.1%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                MAE: 8.4%
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
