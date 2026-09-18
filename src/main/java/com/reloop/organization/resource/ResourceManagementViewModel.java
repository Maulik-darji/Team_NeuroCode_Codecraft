package com.reloop.organization.resource;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.TrackedResource;
import com.reloop.organization.repository.ResourceRepository;

import java.util.List;

public class ResourceManagementViewModel extends ViewModel {

    private final ResourceRepository resourceRepository;
    private final MutableLiveData<List<TrackedResource>> resourcesLiveData = new MutableLiveData<>();

    public ResourceManagementViewModel() {
        this.resourceRepository = new ResourceRepository();
    }

    public LiveData<List<TrackedResource>> getResources() {
        return resourcesLiveData;
    }

    public void loadResources() {
        resourcesLiveData.setValue(resourceRepository.getAllResources());
    }
}
