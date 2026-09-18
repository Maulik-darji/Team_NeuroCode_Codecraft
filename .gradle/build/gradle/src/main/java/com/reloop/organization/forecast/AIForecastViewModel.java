package com.reloop.organization.forecast;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.ForecastResult;
import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.repository.ForecastRepository;
import com.reloop.organization.repository.ResourceRepository;

import java.util.List;

public class AIForecastViewModel extends ViewModel {

    private final ForecastRepository forecastRepository;
    private final ResourceRepository resourceRepository;

    private final MutableLiveData<ForecastResult> forecastLiveData = new MutableLiveData<>();
    private final MutableLiveData<List<HistoricalConsumption>> historyLiveData = new MutableLiveData<>();

    public AIForecastViewModel() {
        this.forecastRepository = new ForecastRepository();
        this.resourceRepository = new ResourceRepository();
    }

    public LiveData<ForecastResult> getForecast() {
        return forecastLiveData;
    }

    public LiveData<List<HistoricalConsumption>> getHistory() {
        return historyLiveData;
    }

    public void loadForecast(String resourceId) {
        forecastLiveData.setValue(forecastRepository.getForecastForResource(resourceId));
        historyLiveData.setValue(resourceRepository.getConsumptionHistory(resourceId));
    }
}
