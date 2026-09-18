package com.reloop.organization.repository;

import com.reloop.organization.contracts.AIServiceContract;
import com.reloop.organization.mock.OrganizationMockData;
import com.reloop.organization.model.AIRecommendation;
import com.reloop.organization.model.ForecastResult;

import java.util.List;

public class ForecastRepository implements AIServiceContract {
    @Override
    public ForecastResult getForecastForResource(String resourceId) {
        return OrganizationMockData.getMockForecast(resourceId);
    }

    @Override
    public List<AIRecommendation> getRecommendationsForResource(String resourceId) {
        return OrganizationMockData.getMockRecommendations();
    }

    @Override
    public boolean applyRecommendation(String recommendationId) {
        for (AIRecommendation rec : OrganizationMockData.getMockRecommendations()) {
            if (rec.getId().equals(recommendationId)) {
                rec.setApplied(true);
                return true;
            }
        }
        return false;
    }
}
