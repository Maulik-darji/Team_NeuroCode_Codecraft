package com.reloop.organization.model;

public class ResourceGoal {
    private String resourceId;
    private String resourceType;
    private String unit;
    private double monthlyTarget;
    private double maximumThreshold;
    private int warningPercentage;
    private int criticalPercentage;
    private String department;
    private boolean pushAlertsEnabled;
    private boolean aiPredictiveAlertsEnabled;

    public ResourceGoal(String resourceId, String resourceType, String unit, double monthlyTarget, double maximumThreshold, int warningPercentage, int criticalPercentage, String department, boolean pushAlertsEnabled, boolean aiPredictiveAlertsEnabled) {
        this.resourceId = resourceId;
        this.resourceType = resourceType;
        this.unit = unit;
        this.monthlyTarget = monthlyTarget;
        this.maximumThreshold = maximumThreshold;
        this.warningPercentage = warningPercentage;
        this.criticalPercentage = criticalPercentage;
        this.department = department;
        this.pushAlertsEnabled = pushAlertsEnabled;
        this.aiPredictiveAlertsEnabled = aiPredictiveAlertsEnabled;
    }

    public String getResourceId() { return resourceId; }
    public String getResourceType() { return resourceType; }
    public String getUnit() { return unit; }
    public double getMonthlyTarget() { return monthlyTarget; }
    public double getMaximumThreshold() { return maximumThreshold; }
    public int getWarningPercentage() { return warningPercentage; }
    public int getCriticalPercentage() { return criticalPercentage; }
    public String getDepartment() { return department; }
    public boolean isPushAlertsEnabled() { return pushAlertsEnabled; }
    public boolean isAiPredictiveAlertsEnabled() { return aiPredictiveAlertsEnabled; }

    public void setMonthlyTarget(double monthlyTarget) { this.monthlyTarget = monthlyTarget; }
    public void setMaximumThreshold(double maximumThreshold) { this.maximumThreshold = maximumThreshold; }
    public void setWarningPercentage(int warningPercentage) { this.warningPercentage = warningPercentage; }
    public void setPushAlertsEnabled(boolean enabled) { this.pushAlertsEnabled = enabled; }
    public void setAiPredictiveAlertsEnabled(boolean enabled) { this.aiPredictiveAlertsEnabled = enabled; }
}
