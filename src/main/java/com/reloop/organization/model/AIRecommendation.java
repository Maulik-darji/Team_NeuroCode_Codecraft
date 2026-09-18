package com.reloop.organization.model;

public class AIRecommendation {
    private String id;
    private String title;
    private String description;
    private String estimatedReduction; // e.g. "-4,200 kWh"
    private String actionSchedule; // e.g. "Run 22:00-06:00 on Pandesara feeder"
    private boolean isApplied;

    public AIRecommendation(String id, String title, String description, String estimatedReduction, String actionSchedule, boolean isApplied) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.estimatedReduction = estimatedReduction;
        this.actionSchedule = actionSchedule;
        this.isApplied = isApplied;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getEstimatedReduction() { return estimatedReduction; }
    public String getActionSchedule() { return actionSchedule; }
    public boolean isApplied() { return isApplied; }
    public void setApplied(boolean applied) { isApplied = applied; }
}
