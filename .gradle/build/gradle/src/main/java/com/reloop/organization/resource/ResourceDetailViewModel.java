package com.reloop.organization.resource;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.model.TrackedResource;
import com.reloop.organization.repository.ResourceRepository;

import java.util.List;

public class ResourceDetailViewModel extends ViewModel {

    private final ResourceRepository resourceRepository;
    private final MutableLiveData<TrackedResource> resourceLiveData = new MutableLiveData<>();
    private final MutableLiveData<List<HistoricalConsumption>> historyLiveData = new MutableLiveData<>();

    public ResourceDetailViewModel() {
        this.resourceRepository = new ResourceRepository();
    }

    public LiveData<TrackedResource> getResource() {
        return resourceLiveData;
    }

    public LiveData<List<HistoricalConsumption>> getHistory() {
        return historyLiveData;
    }

    public void loadResource(String resourceId) {
        resourceLiveData.setValue(resourceRepository.getResourceById(resourceId));
        historyLiveData.setValue(resourceRepository.getConsumptionHistory(resourceId));
    }
}
