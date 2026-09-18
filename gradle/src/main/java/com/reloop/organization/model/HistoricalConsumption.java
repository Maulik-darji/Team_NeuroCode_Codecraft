package com.reloop.organization.model;

public class HistoricalConsumption {
    private String datePeriod; // e.g. "18 Sep", "Apr", "May"
    private double actualConsumption;
    private double targetConsumption;
    private double variancePercent; // +10.5%
    private boolean isForecast;

    public HistoricalConsumption(String datePeriod, double actualConsumption, double targetConsumption, double variancePercent, boolean isForecast) {
        this.datePeriod = datePeriod;
        this.actualConsumption = actualConsumption;
        this.targetConsumption = targetConsumption;
        this.variancePercent = variancePercent;
        this.isForecast = isForecast;
    }

    public String getDatePeriod() { return datePeriod; }
    public double getActualConsumption() { return actualConsumption; }
    public double getTargetConsumption() { return targetConsumption; }
    public double getVariancePercent() { return variancePercent; }
    public boolean isForecast() { return isForecast; }
}
