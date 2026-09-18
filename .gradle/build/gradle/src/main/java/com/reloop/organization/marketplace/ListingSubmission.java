package com.reloop.organization.marketplace;

import java.util.List;

public class ListingSubmission {
    private String submissionId;
    private String organizationId;
    private String title;
    private String category;
    private String condition;
    private int quantityAvailable;
    private String unit;
    private int minimumOrder;
    private double price;
    private boolean isNegotiable;
    private String intent; // SELL, GIVE AWAY, REUSE, REPAIR, RECYCLE
    private String fulfillment;
    private String location;
    private String description;
    private String brand;
    private String model;
    private String year;
    private List<String> imageUris;
    private String timestamp;

    public ListingSubmission(String submissionId, String organizationId, String title, String category, String condition, int quantityAvailable, String unit, int minimumOrder, double price, boolean isNegotiable, String intent, String fulfillment, String location, String description, String brand, String model, String year, List<String> imageUris, String timestamp) {
        this.submissionId = submissionId;
        this.organizationId = organizationId;
        this.title = title;
        this.category = category;
        this.condition = condition;
        this.quantityAvailable = quantityAvailable;
        this.unit = unit;
        this.minimumOrder = minimumOrder;
        this.price = price;
        this.isNegotiable = isNegotiable;
        this.intent = intent;
        this.fulfillment = fulfillment;
        this.location = location;
        this.description = description;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.imageUris = imageUris;
        this.timestamp = timestamp;
    }

    public String getSubmissionId() { return submissionId; }
    public String getOrganizationId() { return organizationId; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getCondition() { return condition; }
    public int getQuantityAvailable() { return quantityAvailable; }
    public String getUnit() { return unit; }
    public int getMinimumOrder() { return minimumOrder; }
    public double getPrice() { return price; }
    public boolean isNegotiable() { return isNegotiable; }
    public String getIntent() { return intent; }
    public String getFulfillment() { return fulfillment; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public String getBrand() { return brand; }
    public String getModel() { return model; }
    public String getYear() { return year; }
    public List<String> getImageUris() { return imageUris; }
    public String getTimestamp() { return timestamp; }

    public String getFormattedPrice() {
        if ("GIVE AWAY".equalsIgnoreCase(intent) || price <= 0) {
            return "FREE";
        }
        return String.format("₹%,.0f", price);
    }
}
