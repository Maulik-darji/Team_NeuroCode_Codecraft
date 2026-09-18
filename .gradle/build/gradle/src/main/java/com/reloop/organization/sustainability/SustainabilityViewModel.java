package com.reloop.organization.sustainability;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.SustainabilityMetrics;
import com.reloop.organization.repository.OrganizationRepository;

public class SustainabilityViewModel extends ViewModel {

    private final OrganizationRepository organizationRepository;
    private final MutableLiveData<SustainabilityMetrics> metricsLiveData = new MutableLiveData<>();

    public SustainabilityViewModel() {
        this.organizationRepository = new OrganizationRepository();
    }

    public LiveData<SustainabilityMetrics> getMetrics() {
        return metricsLiveData;
    }

    public void loadMetrics() {
        metricsLiveData.setValue(organizationRepository.getSustainabilityMetrics());
    }
}
