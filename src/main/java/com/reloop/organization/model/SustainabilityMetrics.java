package com.reloop.organization.model;

public class SustainabilityMetrics {
    private int overallScore; // e.g. 82 / 100
    private int resourceEfficiencyScore; // 88
    private int reuseScore; // 76
    private int recyclingScore; // 91
    private int goalAchievementScore; // 81
    private String energySavedDisplay; // "14,200 kWh"
    private int itemsReusedCount; // 48
    private int itemsRecycledCount; // 320 kg
    private String estimatedCostSavings; // "₹4.8L"
    private String co2ReducedDisplay; // "12.4 tonnes"

    public SustainabilityMetrics(int overallScore, int resourceEfficiencyScore, int reuseScore, int recyclingScore, int goalAchievementScore, String energySavedDisplay, int itemsReusedCount, int itemsRecycledCount, String estimatedCostSavings, String co2ReducedDisplay) {
        this.overallScore = overallScore;
        this.resourceEfficiencyScore = resourceEfficiencyScore;
        this.reuseScore = reuseScore;
        this.recyclingScore = recyclingScore;
        this.goalAchievementScore = goalAchievementScore;
        this.energySavedDisplay = energySavedDisplay;
        this.itemsReusedCount = itemsReusedCount;
        this.itemsRecycledCount = itemsRecycledCount;
        this.estimatedCostSavings = estimatedCostSavings;
        this.co2ReducedDisplay = co2ReducedDisplay;
    }

    public int getOverallScore() { return overallScore; }
    public int getResourceEfficiencyScore() { return resourceEfficiencyScore; }
    public int getReuseScore() { return reuseScore; }
    public int getRecyclingScore() { return recyclingScore; }
    public int getGoalAchievementScore() { return goalAchievementScore; }
    public String getEnergySavedDisplay() { return energySavedDisplay; }
    public int getItemsReusedCount() { return itemsReusedCount; }
    public int getItemsRecycledCount() { return itemsRecycledCount; }
    public String getEstimatedCostSavings() { return estimatedCostSavings; }
    public String getCo2ReducedDisplay() { return co2ReducedDisplay; }
}
