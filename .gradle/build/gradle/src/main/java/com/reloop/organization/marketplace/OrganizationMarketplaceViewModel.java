package com.reloop.organization.marketplace;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import java.util.List;

public class OrganizationMarketplaceViewModel extends ViewModel {

    private final OrganizationMarketplaceRepository repository;
    private final MutableLiveData<List<MarketplaceCategory>> categoriesLiveData = new MutableLiveData<>();
    private final MutableLiveData<List<MarketplaceFilterChip>> filterChipsLiveData = new MutableLiveData<>();
    private final MutableLiveData<List<OrganizationMarketplaceItem>> listingsLiveData = new MutableLiveData<>();

    private String currentQuery = "";
    private String selectedCategory = null;

    public OrganizationMarketplaceViewModel() {
        this.repository = new OrganizationMarketplaceRepository();
    }

    public LiveData<List<MarketplaceCategory>> getCategories() {
        return categoriesLiveData;
    }

    public LiveData<List<MarketplaceFilterChip>> getFilterChips() {
        return filterChipsLiveData;
    }

    public LiveData<List<OrganizationMarketplaceItem>> getListings() {
        return listingsLiveData;
    }

    public void loadData() {
        categoriesLiveData.setValue(repository.getCategories());
        filterChipsLiveData.setValue(repository.getFilterChips());
        performSearchAndFilter();
    }

    public void setSearchQuery(String query) {
        this.currentQuery = query;
        performSearchAndFilter();
    }

    public void selectCategory(String categoryName) {
        if (categoryName != null && categoryName.equalsIgnoreCase(selectedCategory)) {
            selectedCategory = null; // Toggle unselect
        } else {
            selectedCategory = categoryName;
        }

        List<MarketplaceCategory> list = categoriesLiveData.getValue();
        if (list != null) {
            for (MarketplaceCategory cat : list) {
                cat.setSelected(selectedCategory != null && cat.getName().equalsIgnoreCase(selectedCategory));
            }
            categoriesLiveData.setValue(list);
        }

        performSearchAndFilter();
    }

    public void toggleFilterChip(String chipId) {
        List<MarketplaceFilterChip> chips = filterChipsLiveData.getValue();
        if (chips != null) {
            for (MarketplaceFilterChip chip : chips) {
                if (chip.getId().equals(chipId)) {
                    chip.setSelected(!chip.isSelected());
                }
            }
            filterChipsLiveData.setValue(chips);
        }
    }

    public void clearFilters() {
        currentQuery = "";
        selectedCategory = null;
        List<MarketplaceCategory> categories = categoriesLiveData.getValue();
        if (categories != null) {
            for (MarketplaceCategory cat : categories) {
                cat.setSelected(false);
            }
            categoriesLiveData.setValue(categories);
        }
        performSearchAndFilter();
    }

    private void performSearchAndFilter() {
        listingsLiveData.setValue(repository.searchAndFilter(currentQuery, selectedCategory));
    }
}
