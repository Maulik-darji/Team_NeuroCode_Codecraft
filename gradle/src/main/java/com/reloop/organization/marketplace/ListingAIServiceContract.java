package com.reloop.organization.marketplace;

public interface ListingAIServiceContract {
    String suggestCategory(String title, String imageUri);
    String generateDescription(String title, String category, String condition);
    double suggestPriceRange(String title, String category, String condition);
}
