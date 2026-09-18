package com.reloop.organization.contracts;

import com.reloop.organization.model.AIRecommendation;
import com.reloop.organization.model.ForecastResult;

import java.util.List;

public interface AIServiceContract {
    ForecastResult getForecastForResource(String resourceId);
    List<AIRecommendation> getRecommendationsForResource(String resourceId);
    boolean applyRecommendation(String recommendationId);
}
