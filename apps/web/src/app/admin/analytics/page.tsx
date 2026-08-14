import React from 'react';
import { Users, FileText, FileDown, Activity } from 'lucide-react';

export const metadata = {
  title: 'Analytics Dashboard | Bazm-e-Adab',
  description: 'View metrics for users, poems, and PDF generations.',
};

export default function AnalyticsDashboardPage() {
  // Mock data for analytics
  const metrics = [
    {
      title: 'Total Users',
      value: '1,248',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Poems',
      value: '8,439',
      change: '+5%',
      trend: 'up',
      icon: FileText,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'PDF Jobs',
      value: '342',
      change: '+18%',
      trend: 'up',
      icon: FileDown,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Active Sessions',
      value: '156',
      change: '-2%',
      trend: 'down',
      icon: Activity,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Overview of Bazm-e-Adab platform metrics and usage.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/10 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{metric.title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{metric.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {metric.change}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">vs last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future expansion for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-80 flex flex-col items-center justify-center text-gray-400">
            <Activity className="h-10 w-10 mb-4 opacity-50" />
            <p>Activity Chart (Coming Soon)</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-80 flex flex-col items-center justify-center text-gray-400">
            <FileText className="h-10 w-10 mb-4 opacity-50" />
            <p>Content Growth (Coming Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
