import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Badge variant="secondary">Circular Economy Workflow</Badge>
        <h1 className="font-display-hero text-4xl font-bold text-primary mt-3 mb-4">
          How CircleLoop Works
        </h1>
        <p className="font-body-lg text-on-surface-variant text-lg">
          CircleLoop establishes a structured hierarchy to keep resources in high-value usage for as long as possible before responsible recycling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <Card className="border border-outline/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">1</div>
          <h3 className="font-headline-sm text-xl font-bold text-primary">1. Direct Reuse & Secondary Marketplace</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Listing unused equipment, excess raw materials, or office furniture allows other users and verified organizations to buy or take items directly.
          </p>
        </Card>

        <Card className="border border-outline/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">2</div>
          <h3 className="font-headline-sm text-xl font-bold text-primary">2. Field Repair & Refurbishment</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Instead of discarding malfunctioning assets, our AI recommender directs users to certified local repair services and component refurbishers.
          </p>
        </Card>

        <Card className="border border-outline/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">3</div>
          <h3 className="font-headline-sm text-xl font-bold text-primary">3. Non-Profit Grants & Community Giving</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Items listed with a null price (€0 / ₹0) provide verified NGOs, schools, and community centers with high-utility equipment at zero cost.
          </p>
        </Card>

        <Card className="border border-outline/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">4</div>
          <h3 className="font-headline-sm text-xl font-bold text-primary">4. ISO-Certified E-Waste Recycling</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            When assets reach true end-of-life status, CircleLoop dispatches them to audited smelters with zero-landfill chain-of-custody documentation.
          </p>
        </Card>
      </div>
    </div>
  );
};
