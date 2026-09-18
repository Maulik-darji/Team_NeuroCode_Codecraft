package com.reloop.organization.resource;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.repository.ResourceRepository;

import java.util.List;

public class ConsumptionHistoryViewModel extends ViewModel {

    private final ResourceRepository resourceRepository;
    private final MutableLiveData<List<HistoricalConsumption>> historyLiveData = new MutableLiveData<>();

    public ConsumptionHistoryViewModel() {
        this.resourceRepository = new ResourceRepository();
    }

    public LiveData<List<HistoricalConsumption>> getHistory() {
        return historyLiveData;
    }

    public void loadHistory(String resourceId) {
        historyLiveData.setValue(resourceRepository.getConsumptionHistory(resourceId));
    }
}
