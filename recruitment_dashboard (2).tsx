import { useState } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, Target } from 'lucide-react';

// Dashboard for recruitment department performance tracking
export default function RecruitmentDashboard() {
  // Initial data based on provided conversion rates
  const [period, setPeriod] = useState('month');
  const [targetLeads, setTargetLeads] = useState(1000);
  
  // Calculate numbers based on conversion rates
  const calculateFunnel = (initialLeads) => {
    const sentToWork = Math.round(initialLeads * 0.1393);
    const arrivedToWork = Math.round(sentToWork * 0.4125);
    const firstShift = Math.round(arrivedToWork * 0.666);
    const adapted = Math.round(firstShift * 0.227);
    
    return {
      initialLeads,
      sentToWork,
      arrivedToWork,
      firstShift,
      adapted
    };
  };
  
  const funnelData = calculateFunnel(targetLeads);
  
  // Cost calculations
  const leadCost = 41.8; // руб.
  const totalCost = targetLeads * leadCost;
  const costPerAdapted = (targetLeads * leadCost) / funnelData.adapted;
  
  // Funnel data for visualization
  const funnelSteps = [
    { name: 'Обработано лидов', value: funnelData.initialLeads, percent: '100%' },
    { name: 'Направлено на трудоустройство', value: funnelData.sentToWork, percent: '13.93%' },
    { name: 'Доехало до места работы', value: funnelData.arrivedToWork, percent: '41.25%' },
    { name: 'Вышло в 1-ю смену', value: funnelData.firstShift, percent: '66.6%' },
    { name: 'Адаптировалось', value: funnelData.adapted, percent: '22.7%' }
  ];
  
  // Efficiency data (conversion from initial lead to adapted employee)
  const overallEfficiency = (funnelData.adapted / funnelData.initialLeads * 100).toFixed(2);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Monthly data (simulated)
  const monthlyData = [
    { month: 'Янв', leads: 950, adapted: 12 },
    { month: 'Фев', leads: 1100, adapted: 14 },
    { month: 'Мар', leads: 980, adapted: 15 },
    { month: 'Апр', leads: 1050, adapted: 16 },
    { month: 'Май', leads: 1200, adapted: 18 },
    { month: 'Июн', leads: 1000, adapted: 13 }
  ];
  
  // Calculate conversions for breakdown chart
  const conversionBreakdown = [
    { name: 'Лид → Направление', value: 13.93 },
    { name: 'Направление → Доехало', value: 41.25 },
    { name: 'Доехало → 1-я смена', value: 66.6 },
    { name: 'Смена → Адаптация', value: 22.7 },
  ];
  
  // Handle target leads change
  const handleLeadsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setTargetLeads(value);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Дашборд отдела подбора персонала</h1>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              className={`px-3 py-1 rounded ${period === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setPeriod('week')}
            >
              Неделя
            </button>
            <button 
              className={`px-3 py-1 rounded ${period === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setPeriod('month')}
            >
              Месяц
            </button>
            <button 
              className={`px-3 py-1 rounded ${period === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setPeriod('quarter')}
            >
              Квартал
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Целевое количество лидов:</label>
            <input
              type="number"
              min="1"
              value={targetLeads}
              onChange={handleLeadsChange}
              className="border rounded px-2 py-1 w-24 text-right"
            />
          </div>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center mb-2">
            <Users className="text-blue-500 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-700">Конверсия из лида в адаптированного</h3>
          </div>
          <p className="text-2xl font-bold">{overallEfficiency}%</p>
          <p className="text-xs text-gray-500">1 адаптированный на {Math.round(100 / overallEfficiency)} лидов</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center mb-2">
            <DollarSign className="text-green-500 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-700">Стоимость адаптированного</h3>
          </div>
          <p className="text-2xl font-bold">{costPerAdapted.toFixed(0)} ₽</p>
          <p className="text-xs text-gray-500">{leadCost} ₽ за лид × {Math.round(100 / overallEfficiency)} лидов</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-yellow-500 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-700">Всего адаптировано</h3>
          </div>
          <p className="text-2xl font-bold">{funnelData.adapted}</p>
          <p className="text-xs text-gray-500">За выбранный период</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center mb-2">
            <Target className="text-purple-500 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-700">Общие затраты</h3>
          </div>
          <p className="text-2xl font-bold">{totalCost.toLocaleString()} ₽</p>
          <p className="text-xs text-gray-500">{leadCost} ₽ × {targetLeads} лидов</p>
        </div>
      </div>
      
      {/* Recruitment funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Воронка рекрутинга</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={funnelSteps}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
              <Tooltip 
                formatter={(value, name, props) => [`${value} (${props.payload.percent})`, 'Количество']}
                labelFormatter={(value) => `Этап: ${value}`}
              />
              <Bar dataKey="value" fill="#8884d8">
                {funnelSteps.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Показатели конверсии по этапам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={conversionBreakdown}
              margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={70} />
              <YAxis label={{ value: '%', position: 'insideLeft', angle: -90 }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Конверсия']} />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Historical trends */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Динамика показателей по месяцам</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#8884d8" name="Количество лидов" />
            <Line yAxisId="right" type="monotone" dataKey="adapted" stroke="#82ca9d" name="Адаптированные сотрудники" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Bottom stats */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Сводные данные</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Этап воронки</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Конверсия с предыдущего этапа</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Общая конверсия от лида</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {funnelSteps.map((step, index) => {
                const overallConversion = (step.value / funnelSteps[0].value * 100).toFixed(2);
                
                return (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{step.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{step.value}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{step.percent}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{overallConversion}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}