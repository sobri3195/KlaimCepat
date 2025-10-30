import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function BudgetTracker() {
  const [budgets] = useState([
    {
      id: 1,
      category: 'Travel',
      allocated: 50000000,
      spent: 35000000,
      remaining: 15000000,
      percentage: 70
    },
    {
      id: 2,
      category: 'Meals',
      allocated: 20000000,
      spent: 18000000,
      remaining: 2000000,
      percentage: 90
    },
    {
      id: 3,
      category: 'Equipment',
      allocated: 30000000,
      spent: 12000000,
      remaining: 18000000,
      percentage: 40
    },
    {
      id: 4,
      category: 'Training',
      allocated: 15000000,
      spent: 8000000,
      remaining: 7000000,
      percentage: 53
    }
  ]);

  const chartData = budgets.map(budget => ({
    name: budget.category,
    value: budget.spent
  }));

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor your department budget allocation</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
          <Plus size={20} className="mr-2" />
          Add Budget
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Allocated</p>
              <p className="text-2xl font-bold mt-2">
                Rp {totalAllocated.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold mt-2">
                Rp {totalSpent.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Remaining</p>
              <p className="text-2xl font-bold mt-2">
                Rp {totalRemaining.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Budget Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Budget Alerts</h2>
          <div className="space-y-3">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-start">
                <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-red-800">Meals Budget Alert</p>
                  <p className="text-sm text-red-600">90% of budget spent - only Rp 2M remaining</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-500 mr-3 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-yellow-800">Travel Budget Warning</p>
                  <p className="text-sm text-yellow-600">70% of budget spent - Rp 15M remaining</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="flex items-start">
                <TrendingUp className="text-green-500 mr-3 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-green-800">Equipment Budget Healthy</p>
                  <p className="text-sm text-green-600">40% spent - well within budget</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Budget Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets.map((budget) => (
                <tr key={budget.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{budget.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rp {budget.allocated.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rp {budget.spent.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rp {budget.remaining.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className={`h-2.5 rounded-full ${
                            budget.percentage > 80
                              ? 'bg-red-600'
                              : budget.percentage > 60
                              ? 'bg-yellow-600'
                              : 'bg-green-600'
                          }`}
                          style={{ width: `${budget.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{budget.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
