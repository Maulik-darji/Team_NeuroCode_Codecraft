package com.reloop.organization.marketplace;

public class ListingDraft {
    private String title;
    private String category;
    private String condition;
    private String quantity;
    private String unit;
    private String minimumOrder;
    private String price;
    private String intent;
    private String fulfillment;
    private String description;
    private String lastSavedTimestamp;

    public ListingDraft(String title, String category, String condition, String quantity, String unit, String minimumOrder, String price, String intent, String fulfillment, String description, String lastSavedTimestamp) {
        this.title = title;
        this.category = category;
        this.condition = condition;
        this.quantity = quantity;
        this.unit = unit;
        this.minimumOrder = minimumOrder;
        this.price = price;
        this.intent = intent;
        this.fulfillment = fulfillment;
        this.description = description;
        this.lastSavedTimestamp = lastSavedTimestamp;
    }

    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getCondition() { return condition; }
    public String getQuantity() { return quantity; }
    public String getUnit() { return unit; }
    public String getMinimumOrder() { return minimumOrder; }
    public String getPrice() { return price; }
    public String getIntent() { return intent; }
    public String getFulfillment() { return fulfillment; }
    public String getDescription() { return description; }
    public String getLastSavedTimestamp() { return lastSavedTimestamp; }
}
