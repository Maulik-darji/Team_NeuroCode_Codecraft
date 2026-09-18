package com.reloop.organization.marketplace;

public class MarketplaceFilterChip {
    private String id;
    private String label;
    private boolean isSelected;

    public MarketplaceFilterChip(String id, String label, boolean isSelected) {
        this.id = id;
        this.label = label;
        this.isSelected = isSelected;
    }

    public String getId() { return id; }
    public String getLabel() { return label; }
    public boolean isSelected() { return isSelected; }
    public void setSelected(boolean selected) { isSelected = selected; }
}
