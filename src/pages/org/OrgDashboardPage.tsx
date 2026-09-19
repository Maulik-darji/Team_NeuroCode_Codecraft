import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ResourceProgress } from '../../components/common/ResourceProgress';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const OrgDashboardPage: React.FC = () => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState('Electricity');
  const [logValue, setLogValue] = useState('');

  // Daily aggregate consumption data for Recharts
  const chartData = [
    { day: 'Day 01', value: 4800 },
    { day: 'Day 03', value: 5200 },
    { day: 'Day 05', value: 5100 },
    { day: 'Day 08', value: 6410 }, // Peak
    { day: 'Day 10', value: 4900 },
    { day: 'Day 12', value: 5300 },
    { day: 'Today', value: 5750 },
  ];

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display-hero text-3xl font-bold text-primary">
              Bharat Fab Tech Ltd.
            </h1>
            <Badge variant="secondary" icon="verified">Verified Org</Badge>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Pune Fabrication Complex • CIN: U28910MH2012PLC1 • Audit Period: Q1 - Month 02
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => setShowLogModal(true)} icon={<span className="material-symbols-outlined text-[18px]">add_chart</span>}>
            Record Resource Usage
          </Button>
        </div>
      </div>

      {/* Goal Directive Banner */}
      <Card className="mb-6 border border-secondary/20 bg-secondary-fixed/10 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">target</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-base font-bold text-primary">
                Quarterly Goal: Reduce electricity consumption by 15%
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Target: 187,000 kWh limit • Baseline comparison against FY24 monthly peak average
              </p>
            </div>
          </div>
          <Badge variant="secondary" icon="check_circle">On Track</Badge>
        </div>
      </Card>

      {/* Grid of 4 Resource Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ResourceProgress
          name="Electricity"
          unit="kWh"
          currentUsage={142400}
          monthlyLimit={220000}
          icon="bolt"
        />

        <ResourceProgress
          name="Industrial Water"
          unit="kL"
          currentUsage={310}
          monthlyLimit={600}
          icon="water_drop"
        />

        <ResourceProgress
          name="Process Fuel (LPG/Diesel)"
          unit="L"
          currentUsage={1820}
          monthlyLimit={4000}
          icon="local_gas_station"
        />

        <ResourceProgress
          name="Raw Virgin Materials"
          unit="MT"
          currentUsage={42.8}
          monthlyLimit={50}
          icon="inventory_2"
        />
      </div>

      {/* Consumption Graph & AI Prediction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph */}
        <Card className="lg:col-span-8 border border-outline/10 p-space-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-headline-sm text-lg font-bold text-primary">Daily Usage Trend</h3>
              <p className="font-body-sm text-xs text-on-surface-variant">Aggregate energy & material velocity (Past 14 Days)</p>
            </div>
            <span className="font-label-sm text-xs text-secondary font-mono">Peak: Day 08 (6,410 kWh eq)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#717973" fontSize={12} />
                <YAxis stroke="#717973" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #d9e3f9' }}
                />
                <Area type="monotone" dataKey="value" stroke="#006c48" strokeWidth={2.5} fill="#92f7c3" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Prediction Box */}
        <Card className="lg:col-span-4 border border-outline/10 p-space-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-md text-xs text-primary font-bold">AI Resource Prediction</span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-primary mb-2">
              Raw Materials Quota Risk Alert
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant mb-4">
              At current usage pace (85.6% consumed with 12 days remaining), Raw Virgin Materials capacity is estimated to breach monthly threshold by <strong>+4.2 MT</strong>.
            </p>
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline/10 text-xs text-primary">
              💡 <strong>AI Recommendation:</strong> Shift secondary assembly line 2 to reclaimed T-Slot extrusions from local circular marketplace listing #LUP-9842.
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-outline/10 flex justify-between items-center text-xs">
            <span className="text-outline font-mono">Confidence: 94.2%</span>
            <Badge variant="warning">At Risk</Badge>
          </div>
        </Card>
      </div>

      {/* Record Usage Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md border border-outline/10 p-6 shadow-2xl bg-surface-container-lowest">
            <h3 className="font-headline-sm text-xl font-bold text-primary mb-4">Record Daily Usage</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">Select Resource</label>
                <select
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                >
                  <option>Electricity (kWh)</option>
                  <option>Industrial Water (kL)</option>
                  <option>Process Fuel (L)</option>
                  <option>Raw Virgin Materials (MT)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">Usage Quantity</label>
                <input
                  type="number"
                  placeholder="e.g. 520"
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button variant="outline" onClick={() => setShowLogModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => { setShowLogModal(false); setLogValue(''); }}>Save Log</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
