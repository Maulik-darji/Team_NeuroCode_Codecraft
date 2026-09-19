import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const OrganizationsPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Badge variant="primary">Institutional Resource Governance</Badge>
        <h1 className="font-display-hero text-4xl font-bold text-primary mt-3 mb-4">
          CircleLoop for Organizations
        </h1>
        <p className="font-body-lg text-on-surface-variant text-lg">
          Manufacturers, retailers, NGOs, schools, and healthcare institutions monitor consumption, manage surplus assets, and receive AI risk alerts.
        </p>
        <div className="mt-6">
          <Link to="/org/register">
            <Button size="lg" icon={<span className="material-symbols-outlined text-[20px]">corporate_fare</span>}>
              Register Your Organization
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="border border-outline/10 flex flex-col gap-3">
          <span className="material-symbols-outlined text-secondary text-[32px]">bar_chart</span>
          <h3 className="font-headline-sm text-lg font-bold text-primary">Resource Quota Tracking</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Define limits for electricity, water, fuel, raw materials, and custom resources with daily logging and progress graphs.
          </p>
        </Card>

        <Card className="border border-outline/10 flex flex-col gap-3">
          <span className="material-symbols-outlined text-secondary text-[32px]">auto_graph</span>
          <h3 className="font-headline-sm text-lg font-bold text-primary">AI Threshold Predictions</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            AI reads recent usage trends and alerts facility directors before monthly limits are breached.
          </p>
        </Card>

        <Card className="border border-outline/10 flex flex-col gap-3">
          <span className="material-symbols-outlined text-secondary text-[32px]">verified_user</span>
          <h3 className="font-headline-sm text-lg font-bold text-primary">GST/CIN Verification</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Platform admins verify institutional credentials to maintain audit integrity across enterprise transfers.
          </p>
        </Card>
      </div>
    </div>
  );
};
