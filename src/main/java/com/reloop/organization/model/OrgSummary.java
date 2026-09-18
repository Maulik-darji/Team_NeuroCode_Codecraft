package com.reloop.organization.model;

public class OrgSummary {
    private String organizationName;
    private String unitName;
    private String userName;
    private int totalResourcesTracked;
    private int resourcesNeedingAttention;
    private int criticalResourcesCount;
    private int warningResourcesCount;
    private double mainResourcePercentageCap; // e.g. 82%
    private String mainResourceName; // Electricity
    private String surplusValueDisplay; // ₹36.2L
    private int liveListingsCount;
    private int enquiriesCount;
    private int offersCount;

    public OrgSummary(String organizationName, String unitName, String userName, int totalResourcesTracked, int resourcesNeedingAttention, int criticalResourcesCount, int warningResourcesCount, double mainResourcePercentageCap, String mainResourceName, String surplusValueDisplay, int liveListingsCount, int enquiriesCount, int offersCount) {
        this.organizationName = organizationName;
        this.unitName = unitName;
        this.userName = userName;
        this.totalResourcesTracked = totalResourcesTracked;
        this.resourcesNeedingAttention = resourcesNeedingAttention;
        this.criticalResourcesCount = criticalResourcesCount;
        this.warningResourcesCount = warningResourcesCount;
        this.mainResourcePercentageCap = mainResourcePercentageCap;
        this.mainResourceName = mainResourceName;
        this.surplusValueDisplay = surplusValueDisplay;
        this.liveListingsCount = liveListingsCount;
        this.enquiriesCount = enquiriesCount;
        this.offersCount = offersCount;
    }

    public String getOrganizationName() { return organizationName; }
    public String getUnitName() { return unitName; }
    public String getUserName() { return userName; }
    public int getTotalResourcesTracked() { return totalResourcesTracked; }
    public int getResourcesNeedingAttention() { return resourcesNeedingAttention; }
    public int getCriticalResourcesCount() { return criticalResourcesCount; }
    public int getWarningResourcesCount() { return warningResourcesCount; }
    public double getMainResourcePercentageCap() { return mainResourcePercentageCap; }
    public String getMainResourceName() { return mainResourceName; }
    public String getSurplusValueDisplay() { return surplusValueDisplay; }
    public int getLiveListingsCount() { return liveListingsCount; }
    public int getEnquiriesCount() { return enquiriesCount; }
    public int getOffersCount() { return offersCount; }
}
