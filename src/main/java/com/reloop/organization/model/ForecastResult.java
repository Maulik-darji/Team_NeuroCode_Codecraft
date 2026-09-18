package com.reloop.organization.model;

public class ForecastResult {
    private String resourceType;
    private double currentUsage;
    private double predictedUsage;
    private double threshold;
    private String riskLevel; // HIGH, MEDIUM, LOW
    private String predictionDate;
    private String recommendationSummary;
    private String lastUpdated;

    public ForecastResult(String resourceType, double currentUsage, double predictedUsage, double threshold, String riskLevel, String predictionDate, String recommendationSummary, String lastUpdated) {
        this.resourceType = resourceType;
        this.currentUsage = currentUsage;
        this.predictedUsage = predictedUsage;
        this.threshold = threshold;
        this.riskLevel = riskLevel;
        this.predictionDate = predictionDate;
        this.recommendationSummary = recommendationSummary;
        this.lastUpdated = lastUpdated;
    }

    public String getResourceType() { return resourceType; }
    public double getCurrentUsage() { return currentUsage; }
    public double getPredictedUsage() { return predictedUsage; }
    public double getThreshold() { return threshold; }
    public String getRiskLevel() { return riskLevel; }
    public String getPredictionDate() { return predictionDate; }
    public String getRecommendationSummary() { return recommendationSummary; }
    public String getLastUpdated() { return lastUpdated; }

    public double getOverThresholdPercent() {
        if (threshold <= 0) return 0;
        return ((predictedUsage - threshold) / threshold) * 100.0;
    }
}
