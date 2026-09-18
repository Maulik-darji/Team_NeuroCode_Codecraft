package com.reloop.organization.enquiries;

public class OrgEnquiry {
    private String id;
    private String buyerName;
    private String assetTitle;
    private String quantityDisplay;
    private String statusTag; // NEW, OFFER, IN TALKS, COMPLETED
    private String message;
    private String footerDetails;
    private String timestamp;
    private String categoryTab; // NEW, IN_TALKS, COMPLETED
    private boolean isDeclined;

    public OrgEnquiry(String id, String buyerName, String assetTitle, String quantityDisplay,
                      String statusTag, String message, String footerDetails, String timestamp, String categoryTab) {
        this.id = id;
        this.buyerName = buyerName;
        this.assetTitle = assetTitle;
        this.quantityDisplay = quantityDisplay;
        this.statusTag = statusTag;
        this.message = message;
        this.footerDetails = footerDetails;
        this.timestamp = timestamp;
        this.categoryTab = categoryTab;
        this.isDeclined = false;
    }

    public String getId() { return id; }
    public String getBuyerName() { return buyerName; }
    public String getAssetTitle() { return assetTitle; }
    public String getQuantityDisplay() { return quantityDisplay; }
    public String getStatusTag() { return statusTag; }
    public String getMessage() { return message; }
    public String getFooterDetails() { return footerDetails; }
    public String getTimestamp() { return timestamp; }
    public String getCategoryTab() { return categoryTab; }
    public boolean isDeclined() { return isDeclined; }
    public void setDeclined(boolean declined) { isDeclined = declined; }
}
