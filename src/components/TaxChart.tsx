import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export interface TaxChartProps {
  taxBreakdownData?: Array<{ name: string; value: number; color: string }>;
  deductionsData?: Array<{ name: string; value: number; color: string }>;
  yearlyComparisonData?: Array<any>;
}

export const TaxChart: React.FC<TaxChartProps> = ({
  taxBreakdownData = [
    { name: 'Income Tax', value: 180000, color: '#0070ba' },
    { name: 'Health & Education Cess', value: 7200, color: '#003087' },
    { name: 'Net Income', value: 1012800, color: '#00a0e6' }
  ],
  deductionsData = [
    { name: '80C (EPF, ELSS)', value: 150000, color: '#0070ba' },
    { name: '80D (Health Ins.)', value: 25000, color: '#003087' },
    { name: 'Home Loan Interest', value: 200000, color: '#00a0e6' },
    { name: 'HRA', value: 240000, color: '#0099cc' },
    { name: 'Standard Deduction', value: 50000, color: '#66b3ff' }
  ],
  yearlyComparisonData = [
    { year: '2020-21', oldRegime: 195000, newRegime: 210000 },
    { year: '2021-22', oldRegime: 205000, newRegime: 215000 },
    { year: '2022-23', oldRegime: 165000, newRegime: 180000 },
    { year: '2023-24', oldRegime: 187200, newRegime: 198500 },
    { year: '2024-25', oldRegime: 187200, newRegime: 198500 }
  ]
}) => {
  return (
    <Tabs defaultValue="breakdown" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="breakdown">Tax Breakdown</TabsTrigger>
        <TabsTrigger value="deductions">Deductions</TabsTrigger>
        <TabsTrigger value="comparison">Year Comparison</TabsTrigger>
      </TabsList>

      <TabsContent value="breakdown" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-center">Tax Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taxBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taxBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Tax Summary</h3>
            <div className="space-y-4">
              {taxBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Annual Income:</span>
                  <span>₹{taxBreakdownData.reduce((acc, item) => item.name === 'Net Income' ? acc + item.value : acc, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="deductions" className="mt-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-center">Available Deductions</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={deductionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                labelStyle={{ color: '#333' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {deductionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-success-light">
              <p className="font-semibold text-success">Total Deductions</p>
              <p className="text-2xl font-bold text-success">₹{deductionsData.reduce((acc, item) => acc + item.value, 0).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-primary-light">
              <p className="font-semibold text-primary">Tax Savings</p>
              <p className="text-2xl font-bold text-primary">—</p>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="comparison" className="mt-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-center">5-Year Tax Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={yearlyComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                labelStyle={{ color: '#333' }}
              />
              <Legend />
              <Bar 
                dataKey="oldRegime" 
                fill="#0070ba" 
                name="Old Regime"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="newRegime" 
                fill="#003087" 
                name="New Regime"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>
    </Tabs>
  );
};