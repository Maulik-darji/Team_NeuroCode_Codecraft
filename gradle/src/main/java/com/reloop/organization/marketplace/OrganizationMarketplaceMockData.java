package com.reloop.organization.marketplace;

import java.util.ArrayList;
import java.util.List;

public class OrganizationMarketplaceMockData {

    public static List<MarketplaceCategory> getMockCategories() {
        List<MarketplaceCategory> list = new ArrayList<>();
        list.add(new MarketplaceCategory("cat_1", "Machinery", "#0F4C3A", false));
        list.add(new MarketplaceCategory("cat_2", "Materials", "#1A1A1A", false));
        list.add(new MarketplaceCategory("cat_3", "Furniture", "#B47E20", false));
        list.add(new MarketplaceCategory("cat_4", "Electrical", "#4B5563", false));
        list.add(new MarketplaceCategory("cat_5", "Industrial", "#1E3A8A", false));
        list.add(new MarketplaceCategory("cat_6", "Scrap", "#991B1B", false));
        return list;
    }

    public static List<MarketplaceFilterChip> getMockFilterChips() {
        List<MarketplaceFilterChip> list = new ArrayList<>();
        list.add(new MarketplaceFilterChip("chip_1", "Near me", true));
        list.add(new MarketplaceFilterChip("chip_2", "Verified sellers", false));
        list.add(new MarketplaceFilterChip("chip_3", "Under ₹5L", false));
        list.add(new MarketplaceFilterChip("chip_4", "Ready to dispatch", false));
        return list;
    }

    public static List<OrganizationMarketplaceItem> getMockListings() {
        List<OrganizationMarketplaceItem> list = new ArrayList<>();
        list.add(new OrganizationMarketplaceItem(
                "list_1",
                "Lakshmi Rieter G32 ring frame",
                "Shreeji Spinning Mills",
                "Surat, Gujarat",
                "Machinery",
                "₹12,40,000",
                "2 available",
                "Working",
                "MOQ 1",
                "Pickup",
                "Available",
                true,
                "RING FRAME"
        ));
        list.add(new OrganizationMarketplaceItem(
                "list_2",
                "Mild steel offcuts & structural scrap",
                "Anand Infrastructure",
                "Hazira, Surat",
                "Scrap",
                "₹38,500",
                "14 t",
                "Recyclable",
                "MOQ 2 t",
                "Delivery",
                "Available",
                true,
                "MS SCRAP"
        ));
        list.add(new OrganizationMarketplaceItem(
                "list_3",
                "120 workstations + task chairs",
                "Nexus Business Park",
                "Vesu, Surat",
                "Furniture",
                "₹2,900",
                "120 sets",
                "Good",
                "MOQ 20",
                "Pickup",
                "Available",
                true,
                "WORK DESKS"
        ));
        return list;
    }
}
