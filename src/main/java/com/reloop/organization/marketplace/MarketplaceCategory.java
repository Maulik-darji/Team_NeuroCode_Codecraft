package com.reloop.organization.marketplace;

public class MarketplaceCategory {
    private String id;
    private String name;
    private String colorHex;
    private boolean isSelected;

    public MarketplaceCategory(String id, String name, String colorHex, boolean isSelected) {
        this.id = id;
        this.name = name;
        this.colorHex = colorHex;
        this.isSelected = isSelected;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getColorHex() { return colorHex; }
    public boolean isSelected() { return isSelected; }
    public void setSelected(boolean selected) { isSelected = selected; }
}
