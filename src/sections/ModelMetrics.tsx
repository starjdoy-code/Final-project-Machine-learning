import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import { fetchMetrics } from '@/hooks/useApi';
import type { ModelMetrics as ModelMetricsType } from '@/types';

export function ModelMetrics() {
  const [metrics, setMetrics] = useState<ModelMetricsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics().then((data) => {
      setMetrics(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="w-full shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (metrics.length === 0) return null;

  const bestModel = metrics.reduce((prev, curr) => prev.R2 > curr.R2 ? prev : curr);

  return (
    <Card className="w-full shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Model Performance Comparison
        </CardTitle>
        <p className="text-purple-100 text-sm">Evaluation metrics across all trained models</p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Best Model Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-amber-700 font-medium">Best Performing Model</p>
            <p className="text-lg font-bold text-amber-900">{bestModel.Model}</p>
            <p className="text-sm text-amber-600">R² Score: {(bestModel.R2 * 100).toFixed(2)}% | MAE: {bestModel.MAE.toFixed(0)}</p>
          </div>
        </div>

        {/* Metrics Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Model</TableHead>
                <TableHead className="text-right">MAE</TableHead>
                <TableHead className="text-right">RMSE</TableHead>
                <TableHead className="text-right">R² Score</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((m) => {
                const isBest = m.Model === bestModel.Model;
                const r2Percent = Math.min(m.R2 * 100, 100);
                const meetsTarget = m.R2 >= 0.85;

                return (
                  <TableRow key={m.Model} className={isBest ? 'bg-amber-50/50' : ''}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {m.Model}
                        {isBest && <Award className="w-4 h-4 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{m.MAE.toFixed(0)}</TableCell>
                    <TableCell className="text-right">{m.RMSE.toFixed(0)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${meetsTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${r2Percent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{(m.R2 * 100).toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {meetsTarget ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                          <Target className="w-3 h-3 mr-1" />
                          Pass
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Baseline</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Target Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TargetCard
            label="MAE Target"
            value="< 15%"
            achieved={bestModel.MAE / 6500 < 0.15}
            description="Mean Absolute Error"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <TargetCard
            label="RMSE Target"
            value="< 15%"
            achieved={bestModel.RMSE / 6500 < 0.15}
            description="Root Mean Squared Error"
            icon={<BarChart3 className="w-4 h-4" />}
          />
          <TargetCard
            label="R² Target"
            value="> 0.85"
            achieved={bestModel.R2 > 0.85}
            description="Coefficient of Determination"
            icon={<Target className="w-4 h-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function TargetCard({ label, value, achieved, description, icon }: {
  label: string;
  value: string;
  achieved: boolean;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`p-4 rounded-lg border ${achieved ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={achieved ? 'text-emerald-600' : 'text-slate-500'}>{icon}</span>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
      {achieved && (
        <Badge className="mt-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs">
          Achieved
        </Badge>
      )}
    </div>
  );
}
