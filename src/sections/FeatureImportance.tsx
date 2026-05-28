import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Zap, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { fetchFeatureImportance } from '@/hooks/useApi';
import type { FeatureImportance as FeatureImportanceType } from '@/types';

const FEATURE_LABELS: Record<string, string> = {
  'Promo': 'Promotion Active',
  'StoreTypeEncoded': 'Store Type',
  'DayOfWeek': 'Day of Week',
  'AssortmentEncoded': 'Assortment Level',
  'IsHoliday': 'Holiday Effect',
  'Month': 'Season/Month',
  'CompetitionDistance': 'Competition Distance',
  'Store': 'Store ID',
  'Year': 'Year Trend',
  'SchoolHoliday': 'School Holiday',
  'IsWeekend': 'Weekend Effect',
};

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  'Promo': 'Active promotional campaigns significantly boost sales',
  'StoreTypeEncoded': 'Different store formats have varying sales patterns',
  'DayOfWeek': 'Sales vary significantly between weekdays and weekends',
  'AssortmentEncoded': 'Extended product range drives higher sales',
  'IsHoliday': 'Public holidays generally reduce store traffic',
  'Month': 'Seasonal trends affect purchasing behavior',
  'CompetitionDistance': 'Closer competitors may reduce market share',
  'Store': 'Individual store characteristics',
  'Year': 'Long-term growth or decline trends',
  'SchoolHoliday': 'School breaks affect family shopping patterns',
  'IsWeekend': 'Weekend shopping behavior differs from weekdays',
};

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  'Promo': <Zap className="w-4 h-4 text-amber-500" />,
  'StoreTypeEncoded': <BarChart3 className="w-4 h-4 text-indigo-500" />,
  'DayOfWeek': <BarChart3 className="w-4 h-4 text-blue-500" />,
  'AssortmentEncoded': <ArrowUp className="w-4 h-4 text-emerald-500" />,
  'IsHoliday': <ArrowDown className="w-4 h-4 text-red-500" />,
  'Month': <BarChart3 className="w-4 h-4 text-purple-500" />,
  'CompetitionDistance': <Minus className="w-4 h-4 text-orange-500" />,
  'Store': <BarChart3 className="w-4 h-4 text-slate-500" />,
  'Year': <BarChart3 className="w-4 h-4 text-cyan-500" />,
  'SchoolHoliday': <BarChart3 className="w-4 h-4 text-pink-500" />,
  'IsWeekend': <BarChart3 className="w-4 h-4 text-teal-500" />,
};

export function FeatureImportance() {
  const [features, setFeatures] = useState<FeatureImportanceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatureImportance().then((data) => {
      setFeatures(data);
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

  if (features.length === 0) return null;

  const maxImportance = Math.max(...features.map(f => f.importance));

  return (
    <Card className="w-full shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Feature Importance Analysis
        </CardTitle>
        <p className="text-sky-100 text-sm">Key factors influencing sales predictions (XGBoost)</p>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-4">
          {features.map((feature, index) => {
            const label = FEATURE_LABELS[feature.feature] || feature.feature;
            const description = FEATURE_DESCRIPTIONS[feature.feature] || '';
            const icon = FEATURE_ICONS[feature.feature] || <BarChart3 className="w-4 h-4 text-slate-400" />;
            const percentage = (feature.importance / maxImportance) * 100;
            const rank = index + 1;

            let barColor = 'bg-slate-400';
            if (rank === 1) barColor = 'bg-amber-500';
            else if (rank === 2) barColor = 'bg-slate-500';
            else if (rank === 3) barColor = 'bg-orange-500';
            else if (percentage > 50) barColor = 'bg-indigo-500';
            else if (percentage > 20) barColor = 'bg-blue-400';
            else barColor = 'bg-slate-300';

            return (
              <div key={feature.feature} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {rank}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      {icon}
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 max-w-[180px] truncate hidden md:block">{description}</span>
                    <span className="text-sm font-semibold text-slate-900 w-14 text-right">
                      {(feature.importance * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
          <h4 className="text-sm font-semibold text-sky-800 mb-2">Key Insights</h4>
          <ul className="space-y-1.5 text-sm text-sky-700">
            <li className="flex items-start gap-2">
              <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
              <span>Promotions are the strongest driver of sales, increasing revenue by up to 30%</span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
              <span>Store type significantly impacts baseline sales performance</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowDown className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
              <span>Holidays generally reduce store traffic and sales volume</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
