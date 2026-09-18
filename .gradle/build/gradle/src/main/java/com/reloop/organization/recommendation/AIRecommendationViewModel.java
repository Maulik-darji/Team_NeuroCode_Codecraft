package com.reloop.organization.recommendation;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.AIRecommendation;
import com.reloop.organization.repository.ForecastRepository;

import java.util.List;

public class AIRecommendationViewModel extends ViewModel {

    private final ForecastRepository forecastRepository;
    private final MutableLiveData<List<AIRecommendation>> recommendationsLiveData = new MutableLiveData<>();

    public AIRecommendationViewModel() {
        this.forecastRepository = new ForecastRepository();
    }

    public LiveData<List<AIRecommendation>> getRecommendations() {
        return recommendationsLiveData;
    }

    public void loadRecommendations(String resourceId) {
        recommendationsLiveData.setValue(forecastRepository.getRecommendationsForResource(resourceId));
    }

    public void applyRecommendation(String recommendationId) {
        forecastRepository.applyRecommendation(recommendationId);
        loadRecommendations("res_1");
    }
}
