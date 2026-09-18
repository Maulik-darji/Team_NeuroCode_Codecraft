package com.reloop.organization.marketplace;

public class OrganizationMarketplaceItem {
    private String listingId;
    private String title;
    private String sellerName;
    private String location;
    private String category;
    private String priceDisplay;
    private String quantityDisplay;
    private String condition;
    private String moq;
    private String deliveryType;
    private String status; // Available, Reserved, Sold, Free
    private boolean verified;
    private String categoryShortCode; // e.g. "RING FRAME", "MS SCRAP", "WORK DESKS"

    public OrganizationMarketplaceItem(String listingId, String title, String sellerName, String location, String category, String priceDisplay, String quantityDisplay, String condition, String moq, String deliveryType, String status, boolean verified, String categoryShortCode) {
        this.listingId = listingId;
        this.title = title;
        this.sellerName = sellerName;
        this.location = location;
        this.category = category;
        this.priceDisplay = priceDisplay;
        this.quantityDisplay = quantityDisplay;
        this.condition = condition;
        this.moq = moq;
        this.deliveryType = deliveryType;
        this.status = status;
        this.verified = verified;
        this.categoryShortCode = categoryShortCode;
    }

    public String getListingId() { return listingId; }
    public String getTitle() { return title; }
    public String getSellerName() { return sellerName; }
    public String getLocation() { return location; }
    public String getCategory() { return category; }
    public String getPriceDisplay() { return priceDisplay; }
    public String getQuantityDisplay() { return quantityDisplay; }
    public String getCondition() { return condition; }
    public String getMoq() { return moq; }
    public String getDeliveryType() { return deliveryType; }
    public String getStatus() { return status; }
    public boolean isVerified() { return verified; }
    public String getCategoryShortCode() { return categoryShortCode; }

    public String getMetadataText() {
        return condition + " • " + moq + " • " + deliveryType;
    }
}
