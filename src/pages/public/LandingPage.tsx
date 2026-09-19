import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const LandingPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const marketplaceItems = [
    {
      id: 'item-1',
      category: 'Electronics',
      title: 'Dell PowerEdge R740 Server Units (x3)',
      description: 'Decommissioned from climate-controlled cloud suite. Tested RAM and redundant 750W power supply modules intact.',
      price: 68000,
      estNew: '₹2.4L',
      condition: 'Good',
      location: 'Bengaluru, KA',
      seller: 'Verified Org',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlr-Tidf7cRRe4Ofg-IypeQ66-JEOP0aPw8tP7EKAChQLVWIUqDQmccf8G88rp1dJNHWmbslEHTTEluN7SjxnAdoRqVM0PhSDj5TheQAdFkYDw6QliX5jVoFq6f4PPNFCBoGW0CDOwWkHaetO3HwcdK0SqEO-lvynbMpJyicDJ_52DxnrqRiI6SPjVtJBn8-yuZYHDIGCZjLUD9zuNUAAcWQhpa-QLApcyTvVoljxoYMgT90gy-GDu',
      aiPrompt: 'Ask AI about power requirements',
    },
    {
      id: 'item-2',
      category: 'Furniture',
      title: 'Modular Oak Study Benches & Chairs (x15)',
      description: 'Surplus from tech park relocation. Minor cosmetic scuffs, mechanically rock solid. Ideal for community learning centers.',
      price: null, // Free / Give Away
      estNew: 'Grant Only',
      condition: 'Fair',
      location: 'Ahmedabad, GJ',
      seller: 'NGO Priority',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLtu22lrWEHOYxes-Kp2zKHFtFJvFkd5xmnV7QtmLPsas2Ua1TBydRh1Ijl8N5NkJlPtOYZ-S7SMfADSB137J4V2w3Uk9sHoCupe508hGb7LVzgss3mhF6PUO5yWXGFXfVgJoj6BJAWHThduzktaONqrk-zg9V8PlDyRAcW3St7H_A5yv3fBJFdGuDzx_uqVQhWFEY2M1PMpI0nOrN3M1qsb8lx7uK-cD6LtZEYDE3ylYEGC8Uug9K',
      aiPrompt: 'Ask AI donation criteria',
    },
    {
      id: 'item-3',
      category: 'Machinery',
      title: 'Precision Lathe 3-Phase Unit',
      description: 'Calibrated toolpost, includes secondary coolant pump and digital readout display. Complete servicing history available.',
      price: 115000,
      estNew: '1,200 hrs logged',
      condition: 'Good',
      location: 'Coimbatore, TN',
      seller: 'GST Verified',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcydkiMII4kUYh0tUY4qujRACGt5j_g-tU9ZaWeBNDWvL1r0MQnMC3YAS1v9M4Ta_aCoF1gUmqrjkCW_c7pHhoLDkxafCxKjMxKcrm9hadyzVZH_GUtejql2grdKZtmGw4tLsRbOnpNHKZXQCnmeaRzjUlIGy9v00Dkbmmqt9pHiCPm0qynqafJsF0JMOWX7FRDFVPaFNvJkPEyJx4ic5GUsnIrLUwPrzmMXng4zDmBXaTTRSYavdc',
      aiPrompt: 'Ask AI specs & power input',
    },
    {
      id: 'item-4',
      category: 'Materials',
      title: 'T-Slot Aluminum Extrusions 40x40 (450m)',
      description: 'Surplus from automated packaging line build. 6063-T5 alloy, anodized clear finish in original protective film.',
      price: 32500,
      estNew: 'Lot price',
      condition: 'New',
      location: 'Pune, MH',
      seller: 'Mill Certified',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaVtMcO72tKYFPR2HAbkxRwCaWCfyfwx5wvcstUUvCL-CNajH-al3mfIIO0wJcvhdLdL9MbcDfKZwohn6dO2DsjiESrcJ4pUWGSo_QuHUZhiR_V9LBU-Udpj14pEbB4VTuIbHVbiC1jZh5MOZOuHzMfgoEygokS9feJ1dqtk4uoWpRY8a2295IaRLz2MTxGs6amYSlgHSbDxo7xmFzSf6V4I1SbzgkMtccqbM8W9JVnUWnl_V67Kfx',
      aiPrompt: 'Ask AI about cut sizing',
    },
  ];

  const filteredItems = activeCategory === 'All'
    ? marketplaceItems
    : activeCategory === 'Free'
    ? marketplaceItems.filter(i => i.price === null)
    : marketplaceItems.filter(i => i.category === activeCategory);

  return (
    <div className="w-full pt-20 bg-background max-w-[1440px] mx-auto px-4 md:px-margin">
      <div className="flex flex-col w-full">
        {/* Subtle Ambient Glow Layer */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-40 right-1/4 w-[540px] h-[540px] rounded-full bg-secondary-fixed/30 blur-[130px] pointer-events-none" />
          <div className="absolute top-96 -left-32 w-[460px] h-[460px] rounded-full bg-tertiary-fixed/35 blur-[120px] pointer-events-none" />

          {/* 1. HERO SECTION */}
          <section className="relative pt-12 pb-20 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              {/* Hero Copy */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-secondary-container/50 text-on-secondary-container w-fit">
                  <span className="material-symbols-outlined text-[16px] text-secondary">autorenew</span>
                  <span className="font-label-sm text-xs tracking-wide uppercase font-semibold">
                    Circular Economy Platform • Reuse • Repair • Donate • Recycle
                  </span>
                </div>
                <h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight font-bold leading-tight">
                  Give resources a <span className="text-secondary italic">second life.</span>
                </h1>
                <p className="font-body-lg text-lg text-on-surface-variant max-w-xl">
                  CircleLoop connects people and organizations to reuse, repair, share, and recycle industrial and office assets before they become permanent landfill waste.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                  <Link to="/marketplace">
                    <Button size="lg" icon={<span className="material-symbols-outlined text-[20px]">east</span>}>
                      Explore Marketplace
                    </Button>
                  </Link>
                  <Link to="/org/register">
                    <Button variant="outline" size="lg" icon={<span className="material-symbols-outlined text-[20px]">corporate_fare</span>}>
                      For Organizations
                    </Button>
                  </Link>
                </div>

                {/* Quick Trust Metadata */}
                <div className="grid grid-cols-3 gap-space-md pt-space-lg border-t border-outline/10">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-2xl font-bold text-primary">100%</span>
                    <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Zero-Landfill Aim</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-2xl font-bold text-primary">GST/CIN</span>
                    <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Enterprise Verified</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-2xl font-bold text-primary">Real-time</span>
                    <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">LCA & ESG Metrics</span>
                  </div>
                </div>
              </div>

              {/* Hero Interactive Circular Resource Flow Card */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                <Card className="shadow-xl relative overflow-hidden border border-outline/10">
                  <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                      <span className="font-label-md text-xs text-primary font-bold">Active Resource Transfer</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-[11px]">
                      TXN #LUP-9842
                    </span>
                  </div>

                  <div className="bg-surface-container-low rounded-lg p-3 flex gap-3 items-center">
                    <img
                      className="w-16 h-16 rounded-md object-cover bg-surface-container"
                      alt="Spectro-Microscope"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzCPTh8bjLjUr7M-fjL3c344G8qRxZQCFtBVP6x-udMVxsEUlVigGCUuiKKS93Tjh9t882tFCpvSxZW5lgfknITYH4ST-jjKj5IBPbbUWMPXJ3NFWtQqjMyqyT3edt9DClb8xwn7yEqdBcTDGCO8cfzEB6LHiHUw3dVELJ34n5b_WPYywFKSvyxo7SmbX_ONvgpt1YVcgRyIzVpVkFtS4apqKIVQxcjSb_zX7I2j0167Vweldamnml"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-[11px] text-secondary uppercase font-bold tracking-wide">
                        Category: Laboratory Testing
                      </span>
                      <span className="font-headline-sm text-base text-primary truncate font-bold">
                        Olympus BX53 Spectro-Microscope
                      </span>
                      <span className="font-body-sm text-xs text-on-surface-variant">
                        Condition: Refurbished Grade A • Bengaluru
                      </span>
                    </div>
                  </div>

                  {/* Multi-step progress bar */}
                  <div className="py-space-md flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant">
                      <span>Material Life Cycle</span>
                      <span className="font-semibold text-primary">Step 3 of 4: Direct Redeployment</span>
                    </div>
                    <div className="relative w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '75%' }} />
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center pt-1 font-label-sm text-[11px] text-on-surface-variant">
                      <span className="text-secondary font-medium">Decommission</span>
                      <span className="text-secondary font-medium">Inspection</span>
                      <span className="text-primary font-bold">Transfer</span>
                      <span className="text-outline">Recertified</span>
                    </div>
                  </div>

                  {/* Origin & Receiver details */}
                  <div className="bg-surface-container-lowest rounded-lg p-2.5 grid grid-cols-2 gap-2 font-label-sm text-xs border border-outline/10">
                    <div className="flex flex-col bg-surface-container-low p-2 rounded">
                      <span className="text-on-surface-variant text-[11px]">Origin Dispatched</span>
                      <span className="font-semibold text-primary">TechCorp Hub 4, Pune</span>
                    </div>
                    <div className="flex flex-col bg-surface-container-low p-2 rounded">
                      <span className="text-on-surface-variant text-[11px]">Receiving Institution</span>
                      <span className="font-semibold text-primary">Apex Innovation Lab</span>
                    </div>
                  </div>

                  {/* Carbon metric */}
                  <div className="mt-space-md p-2.5 rounded-lg bg-secondary-fixed/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">eco</span>
                      <span className="font-body-sm text-xs text-primary font-medium">Carbon Avoided: 480 kg CO₂e</span>
                    </div>
                    <span className="font-label-sm text-[11px] text-on-secondary-fixed-variant font-bold">Verified Ledger</span>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* 2. HOW CIRCLELOOP WORKS */}
          <section className="py-space-xl">
            <div className="flex flex-col gap-1 text-center max-w-2xl mx-auto mb-space-xl">
              <span className="font-label-md text-xs text-secondary uppercase tracking-widest font-semibold">
                Autonomous Lifecycle Engine
              </span>
              <h2 className="font-headline-lg text-3xl font-bold text-primary">How CircleLoop Works</h2>
              <p className="font-body-md text-on-surface-variant text-base">
                A methodical approach turning idle industrial inventories, office electronics, and excess raw materials into circular balance sheets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {/* Step 1 */}
              <Card className="flex flex-col justify-between border border-outline/10">
                <div className="flex flex-col gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="font-display-hero text-2xl font-bold text-secondary">01</span>
                  </div>
                  <h3 className="font-headline-sm text-lg font-bold text-primary">List or Request Unused Resources</h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Post machinery, idle enterprise workstations, bulk modular furniture, or production cutoffs in minutes.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-xs font-semibold border-t border-outline/10">
                  <span>Electronics, Tools, Modular Fitouts</span>
                </div>
              </Card>

              {/* Step 2 */}
              <Card className="flex flex-col justify-between border border-outline/10">
                <div className="flex flex-col gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="font-display-hero text-2xl font-bold text-secondary">02</span>
                  </div>
                  <h3 className="font-headline-sm text-lg font-bold text-primary">AI-Powered Matching & Smart Assistant</h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Deterministic query algorithms pair resource offers with nearby educational bodies, makers, and corporate teams.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-xs font-semibold border-t border-outline/10">
                  <span>Hallucination-free Q&A models</span>
                </div>
              </Card>

              {/* Step 3 */}
              <Card className="flex flex-col justify-between border border-outline/10">
                <div className="flex flex-col gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="font-display-hero text-2xl font-bold text-secondary">03</span>
                  </div>
                  <h3 className="font-headline-sm text-lg font-bold text-primary">Extend Resource Lifespan</h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Direct secondary sales, structured zero-rupee charity donations, or certified field repair bookings dispatched with 1 click.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-xs font-semibold border-t border-outline/10">
                  <span>Direct Exchange & Repair Hubs</span>
                </div>
              </Card>

              {/* Step 4 */}
              <Card className="flex flex-col justify-between border border-outline/10">
                <div className="flex flex-col gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="font-display-hero text-2xl font-bold text-secondary">04</span>
                  </div>
                  <h3 className="font-headline-sm text-lg font-bold text-primary">Responsible Recycling & Diversion</h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    When an asset reaches genuine end-of-life, automated handoffs guide it strictly to ISO-accredited e-waste smelters.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-xs font-semibold border-t border-outline/10">
                  <span>Full Chain-of-Custody Manifest</span>
                </div>
              </Card>
            </div>
          </section>

          {/* 3. LIVE CIRCULAR MARKETPLACE PREVIEW */}
          <section className="py-space-xl">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-space-md mb-space-lg">
              <div>
                <span className="font-label-md text-xs text-secondary uppercase tracking-widest font-semibold">
                  Secondary Asset Exchange
                </span>
                <h2 className="font-headline-lg text-3xl font-bold text-primary">Live Circular Marketplace</h2>
                <p className="font-body-md text-on-surface-variant text-base">
                  Discover high-utility machinery, office hardware, and reclaimed industrial raw materials ready for immediate transfer.
                </p>
              </div>
              <Link to="/marketplace" className="inline-flex items-center gap-1 font-label-md text-sm text-primary font-semibold hover:text-secondary transition-colors">
                <span>View All Listings</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm mb-space-lg flex flex-col lg:flex-row gap-space-md items-center justify-between border border-outline/10">
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {['All', 'Electronics', 'Furniture', 'Machinery', 'Materials', 'Free'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {cat === 'Free' ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">card_giftcard</span>
                        <span>Free / Give Away</span>
                      </span>
                    ) : (
                      cat
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Marketplace Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {filteredItems.map((item) => (
                <Card key={item.id} hoverable className="flex flex-col justify-between border border-outline/10 overflow-hidden p-0">
                  <div className="relative h-48 bg-surface-container overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-[11px] font-semibold">
                      {item.category}
                    </span>
                    <span className="absolute top-3 right-3">
                      {item.price === null ? (
                        <Badge variant="free" icon="volunteer_activism">Free</Badge>
                      ) : (
                        <Badge variant="secondary">{item.condition}</Badge>
                      )}
                    </span>
                  </div>

                  <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                    <div>
                      <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[11px] mb-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {item.location}
                        </span>
                        <span className="text-secondary font-medium">{item.seller}</span>
                      </div>
                      <h3 className="font-headline-sm text-base leading-tight text-primary font-bold">
                        {item.title}
                      </h3>
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-space-xs flex flex-col gap-2 border-t border-outline/10">
                      <div className="flex items-baseline justify-between">
                        {item.price === null ? (
                          <span className="font-headline-sm text-xl font-bold text-secondary">₹0</span>
                        ) : (
                          <span className="font-headline-sm text-xl font-bold text-primary">₹{item.price.toLocaleString()}</span>
                        )}
                        <span className="font-label-sm text-[11px] text-on-surface-variant">{item.estNew}</span>
                      </div>

                      <button className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-secondary-fixed/40 text-on-secondary-fixed-variant hover:bg-secondary-fixed transition-colors font-label-sm text-xs font-semibold">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                        <span>{item.aiPrompt}</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* 4. INSTITUTIONAL RESOURCE MONITORING */}
          <section className="py-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              {/* Left narrative */}
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-low text-primary w-fit font-label-sm text-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary">domain_verification</span>
                  <span>Enterprise Sustainability Governance</span>
                </div>
                <h2 className="font-headline-lg text-3xl font-bold text-primary">
                  Institutional Resource Monitoring
                </h2>
                <p className="font-body-md text-on-surface-variant text-base">
                  Connect production floors, corporate campuses, and data centers. Monitor granular usage limits across four critical resource vectors in compliance with ISO 14044 / GHG Protocol standards.
                </p>

                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <div className="flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-base text-primary font-bold">Automated Quota Threshold Alerts</span>
                      <span className="font-body-sm text-xs text-on-surface-variant">Trigger operational dispatches when usage pace crosses 80% before monthly budget closure.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-base text-primary font-bold">Cross-Campus Asset Reclamation</span>
                      <span className="font-body-sm text-xs text-on-surface-variant">Facilitate private internal transfers between regional subsidiary branches prior to public listing.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-space-xs">
                  <Link to="/org/register">
                    <Button variant="primary" icon={<span className="material-symbols-outlined text-[18px]">launch</span>}>
                      Explore Organization Console
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Live Dashboard Snapshot */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl border border-outline/10">
                <div className="flex flex-wrap items-center justify-between pb-space-md mb-space-md border-b border-outline/10">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-lg font-bold text-primary">Bharat Fab Tech Ltd.</span>
                      <Badge variant="secondary">Active Org</Badge>
                    </div>
                    <span className="font-label-sm text-xs text-on-surface-variant">
                      Operational Unit: Pune Fabrication Complex (CIN: U28910MH2012PLC1)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-[11px] text-outline uppercase font-semibold">Audit Period</span>
                    <p className="font-label-md text-sm font-bold text-primary">Q1 - Month 02</p>
                  </div>
                </div>

                {/* Directive Banner */}
                <div className="bg-surface-container-low p-3 rounded-lg mb-space-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">target</span>
                    <div>
                      <p className="font-label-md text-xs font-bold text-primary">Quarterly Directive: Reduce electricity consumption by 15%</p>
                      <p className="font-label-sm text-[11px] text-on-surface-variant">Baseline comparison calculated against FY24 monthly peak average</p>
                    </div>
                  </div>
                  <Badge variant="secondary" icon="check_circle">On Track</Badge>
                </div>

                {/* Resource Metric Bars */}
                  <div className="flex flex-col gap-2.5 mb-space-lg">
                  <div className="bg-surface-container-low/40 p-3 rounded-lg flex flex-col gap-1">
                    <div className="flex items-center justify-between font-label-sm text-xs">
                      <span className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                        <span>Electricity</span>
                      </span>
                      <span className="text-on-surface-variant">142,400 / 220,000 kWh</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '64.7%' }} />
                    </div>
                  </div>

                  <div className="bg-surface-container-low/40 p-3 rounded-lg flex flex-col gap-1">
                    <div className="flex items-center justify-between font-label-sm text-xs">
                      <span className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">water_drop</span>
                        <span>Industrial Water</span>
                      </span>
                      <span className="text-on-surface-variant">310 / 600 kL</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '51.6%' }} />
                    </div>
                  </div>

                  <div className="bg-surface-container-low/40 p-3 rounded-lg flex flex-col gap-1">
                    <div className="flex items-center justify-between font-label-sm text-xs">
                      <span className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
                        <span>Raw Virgin Materials</span>
                      </span>
                      <span className="text-on-surface-variant">42.8 / 50 MT</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-error rounded-full" style={{ width: '85.6%' }} />
                    </div>
                  </div>
                </div>

                {/* SVG Trend Graph */}
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-xs font-semibold text-primary">Daily Aggregate Consumption (Past 14 Days)</span>
                    <span className="font-label-sm text-[11px] text-secondary font-mono">Peak: Day 08 (6,410 kWh eq)</span>
                  </div>
                  <div className="h-16 w-full pt-1">
                    <svg className="w-full h-full text-secondary" viewBox="0 0 500 80" preserveAspectRatio="none" fill="none">
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="0,65 35,58 70,62 105,45 140,50 175,38 210,42 245,22 280,35 315,30 350,44 385,28 420,32 460,25 500,20"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. AI SUSTAINABILITY & RESOURCE PREDICTION */}
          <section id="ai-impact" className="py-space-xl">
            <div className="flex flex-col gap-1 text-center max-w-3xl mx-auto mb-space-xl">
              <span className="font-label-md text-xs text-secondary uppercase tracking-widest font-semibold">
                Strict Data Grounding
              </span>
              <h2 className="font-headline-lg text-3xl font-bold text-primary">AI Sustainability & Resource Prediction</h2>
              <p className="font-body-md text-on-surface-variant text-base">
                Zero hallucination models. CircleLoop leverages deterministic mathematical checks and verified metadata to assist buyers and facility directors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* 4 Pillars */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <Card className="border border-outline/10 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[22px]">quickreply</span>
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-primary">AI Buyer Assistant</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Answers specification, condition, and availability questions based strictly on vendor documentation.
                  </p>
                </Card>

                <Card className="border border-outline/10 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[22px]">trending_up</span>
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-primary">AI Resource Prediction</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Calculates usage velocities, predicts month-end quota overruns, and suggests early load shedding.
                  </p>
                </Card>

                <Card className="border border-outline/10 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[22px]">build_circle</span>
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-primary">Repair & Recycling Assistant</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Assesses economic viability between refurbishing vs raw material breakdown and locates audited smelters.
                  </p>
                </Card>

                <Card className="border border-outline/10 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-primary">AI Listing Generator</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Converts spec sheets and photos into structured marketplace entries with verified tags.
                  </p>
                </Card>
              </div>

              {/* AI Session Card */}
              <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl border border-outline/10">
                <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                    <span className="font-label-md text-xs text-primary font-bold">CircleLoop AI Query Session</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-low text-primary font-label-sm text-[11px] font-mono">
                    Grounding: Dell_R740_Specs.pdf
                  </span>
                </div>

                  <div className="flex flex-col gap-3 font-body-sm text-xs">
                    <div className="bg-surface-container-low p-3 rounded-lg text-primary font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">forum</span>
                      <span><strong>Buyer:</strong> "Can these servers run on standard 220V 1-phase AC input?"</span>
                    </div>
                    <div className="bg-secondary-fixed/20 p-3 rounded-lg text-on-secondary-fixed-variant border border-secondary/20 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">smart_toy</span>
                      <span><strong>CircleLoop AI:</strong> "Yes. The 750W Platinum power supply units support 100-240V AC input at 50/60Hz. Standard 220V 1-phase AC is fully supported."</span>
                    </div>
                  </div>
              </div>
            </div>
          </section>

          {/* 6. REPAIR & RECYCLING CTA */}
          <section className="py-space-xl bg-primary text-on-primary rounded-2xl p-space-xl my-space-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-8 flex flex-col gap-space-sm">
                <Badge variant="accent">Resource Life Extension</Badge>
                <h2 className="font-headline-lg text-3xl font-bold text-on-primary">
                  Have decommissioned assets or unused inventory?
                </h2>
                <p className="font-body-md text-on-primary-container text-base">
                  Get instant AI repair, recycling, donation, or marketplace recommendations with certified chain-of-custody tracking.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2">
                <Link to="/repair-recycle">
                  <Button variant="secondary" size="lg" className="w-full">
                    Find Repair & Recycling
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" size="lg" className="w-full border-on-primary-container text-on-primary hover:bg-primary-container">
                    List Item for Reuse
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
