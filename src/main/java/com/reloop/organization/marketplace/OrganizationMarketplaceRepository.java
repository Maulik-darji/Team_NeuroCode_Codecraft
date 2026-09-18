package com.reloop.organization.marketplace;

import java.util.ArrayList;
import java.util.List;

public class OrganizationMarketplaceRepository {

    public List<MarketplaceCategory> getCategories() {
        return OrganizationMarketplaceMockData.getMockCategories();
    }

    public List<MarketplaceFilterChip> getFilterChips() {
        return OrganizationMarketplaceMockData.getMockFilterChips();
    }

    public List<OrganizationMarketplaceItem> getListings() {
        return OrganizationMarketplaceMockData.getMockListings();
    }

    public List<OrganizationMarketplaceItem> searchAndFilter(String query, String categoryFilter) {
        List<OrganizationMarketplaceItem> all = getListings();
        if ((query == null || query.trim().isEmpty()) && (categoryFilter == null || categoryFilter.isEmpty())) {
            return all;
        }

        List<OrganizationMarketplaceItem> filtered = new ArrayList<>();
        String lowerQuery = query != null ? query.trim().toLowerCase() : "";

        for (OrganizationMarketplaceItem item : all) {
            boolean matchesQuery = lowerQuery.isEmpty()
                    || item.getTitle().toLowerCase().contains(lowerQuery)
                    || item.getSellerName().toLowerCase().contains(lowerQuery)
                    || item.getCategory().toLowerCase().contains(lowerQuery);

            boolean matchesCategory = categoryFilter == null
                    || categoryFilter.isEmpty()
                    || item.getCategory().equalsIgnoreCase(categoryFilter);

            if (matchesQuery && matchesCategory) {
                filtered.add(item);
            }
        }
        return filtered;
    }
}
