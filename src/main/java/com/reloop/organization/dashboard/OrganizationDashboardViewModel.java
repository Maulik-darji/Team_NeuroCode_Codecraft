package com.reloop.organization.dashboard;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.ForecastResult;
import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.model.OrgSummary;
import com.reloop.organization.repository.ForecastRepository;
import com.reloop.organization.repository.OrganizationRepository;
import com.reloop.organization.repository.ResourceRepository;

import java.util.List;

public class OrganizationDashboardViewModel extends ViewModel {

    private final OrganizationRepository orgRepository;
    private final ForecastRepository forecastRepository;
    private final ResourceRepository resourceRepository;

    private final MutableLiveData<OrgSummary> summaryLiveData = new MutableLiveData<>();
    private final MutableLiveData<ForecastResult> forecastLiveData = new MutableLiveData<>();
    private final MutableLiveData<List<HistoricalConsumption>> historyLiveData = new MutableLiveData<>();

    public OrganizationDashboardViewModel() {
        this.orgRepository = new OrganizationRepository();
        this.forecastRepository = new ForecastRepository();
        this.resourceRepository = new ResourceRepository();
    }

    public LiveData<OrgSummary> getSummary() {
        return summaryLiveData;
    }

    public LiveData<ForecastResult> getForecast() {
        return forecastLiveData;
    }

    public LiveData<List<HistoricalConsumption>> getHistory() {
        return historyLiveData;
    }

    public void loadDashboardData() {
        summaryLiveData.setValue(orgRepository.getSummary());
        forecastLiveData.setValue(forecastRepository.getForecastForResource("res_1"));
        historyLiveData.setValue(resourceRepository.getConsumptionHistory("res_1"));
    }
}
