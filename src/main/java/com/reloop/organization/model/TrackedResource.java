package com.reloop.organization.model;

public class TrackedResource {
    private String id;
    private String name; // Electricity, Water, Fuel, Waste, Materials
    private String unit; // kWh, L, KL, t, kg
    private double currentConsumption;
    private double limit;
    private double warningThresholdPercent;
    private String status; // SAFE, WARNING, CRITICAL, EXCEEDED
    private String department;
    private double predictedConsumption;
    private double trendChangePercent; // e.g. +11.4%

    public TrackedResource(String id, String name, String unit, double currentConsumption, double limit, double warningThresholdPercent, String status, String department, double predictedConsumption, double trendChangePercent) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.currentConsumption = currentConsumption;
        this.limit = limit;
        this.warningThresholdPercent = warningThresholdPercent;
        this.status = status;
        this.department = department;
        this.predictedConsumption = predictedConsumption;
        this.trendChangePercent = trendChangePercent;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getUnit() { return unit; }
    public double getCurrentConsumption() { return currentConsumption; }
    public double getLimit() { return limit; }
    public double getWarningThresholdPercent() { return warningThresholdPercent; }
    public String getStatus() { return status; }
    public String getDepartment() { return department; }
    public double getPredictedConsumption() { return predictedConsumption; }
    public double getTrendChangePercent() { return trendChangePercent; }

    public int getUsagePercentage() {
        if (limit <= 0) return 0;
        return (int) Math.round((currentConsumption / limit) * 100);
    }
}
