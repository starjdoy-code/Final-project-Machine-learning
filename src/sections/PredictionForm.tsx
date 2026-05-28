import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Store, ShoppingCart, TrendingUp, MapPin, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { PredictionInput } from '@/types';

interface PredictionFormProps {
  onPredict: (input: PredictionInput) => void;
  loading: boolean;
}

export function PredictionForm({ onPredict, loading }: PredictionFormProps) {
  const [date, setDate] = useState<Date>(new Date('2015-07-31'));
  const [storeType, setStoreType] = useState('a');
  const [assortment, setAssortment] = useState('a');
  const [promo, setPromo] = useState(false);
  const [schoolHoliday, setSchoolHoliday] = useState(false);
  const [stateHoliday, setStateHoliday] = useState('0');
  const [competitionDistance, setCompetitionDistance] = useState([1000]);
  const [storeId, setStoreId] = useState('1');
  const [model, setModel] = useState('xgboost');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict({
      store_type: storeType,
      assortment: assortment,
      promo: promo,
      school_holiday: schoolHoliday,
      competition_distance: competitionDistance[0],
      date: format(date, 'yyyy-MM-dd'),
      state_holiday: stateHoliday,
      store_id: parseInt(storeId) || 1,
      model: model,
    });
  };

  return (
    <Card className="w-full shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Store className="w-5 h-5" />
          Sales Prediction Input
        </CardTitle>
        <p className="text-indigo-100 text-sm">Configure store parameters to predict daily sales</p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              ML Model
            </Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xgboost">XGBoost (Tuned) - Best</SelectItem>
                <SelectItem value="random_forest">Random Forest - Main</SelectItem>
                <SelectItem value="linear">Linear Regression - Baseline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Store Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Store className="w-4 h-4 text-indigo-600" />
                Store Type
              </Label>
              <Select value={storeType} onValueChange={setStoreType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Type A (Standard)</SelectItem>
                  <SelectItem value="b">Type B (Large)</SelectItem>
                  <SelectItem value="c">Type C (Small)</SelectItem>
                  <SelectItem value="d">Type D (Express)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assortment */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-indigo-600" />
                Assortment Level
              </Label>
              <Select value={assortment} onValueChange={setAssortment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Basic</SelectItem>
                  <SelectItem value="b">Extra</SelectItem>
                  <SelectItem value="c">Extended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                Transaction Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Store ID */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Store ID
              </Label>
              <Input
                type="number"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                min={1}
                max={200}
                className="w-full"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="promo" className="text-sm font-medium cursor-pointer">
                Active Promotion
              </Label>
              <Switch id="promo" checked={promo} onCheckedChange={setPromo} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="school-holiday" className="text-sm font-medium cursor-pointer">
                School Holiday
              </Label>
              <Switch id="school-holiday" checked={schoolHoliday} onCheckedChange={setSchoolHoliday} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="state-holiday" className="text-sm font-medium cursor-pointer">
                State Holiday
              </Label>
              <Switch id="state-holiday" checked={stateHoliday !== '0'} onCheckedChange={(v) => setStateHoliday(v ? 'a' : '0')} />
            </div>
          </div>

          {/* Competition Distance */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Competition Distance
              </Label>
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {competitionDistance[0]} m
              </span>
            </div>
            <Slider
              value={competitionDistance}
              onValueChange={setCompetitionDistance}
              min={0}
              max={20000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0m (Very Close)</span>
              <span>10,000m</span>
              <span>20,000m (Far)</span>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-6 text-lg shadow-md"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Predict Sales
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
