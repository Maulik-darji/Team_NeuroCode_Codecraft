package com.reloop.organization.alerts;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.OrgAlert;
import com.reloop.organization.repository.AlertRepository;

import java.util.List;

public class OrganizationAlertsViewModel extends ViewModel {

    private final AlertRepository alertRepository;
    private final MutableLiveData<List<OrgAlert>> alertsLiveData = new MutableLiveData<>();

    public OrganizationAlertsViewModel() {
        this.alertRepository = new AlertRepository();
    }

    public LiveData<List<OrgAlert>> getAlerts() {
        return alertsLiveData;
    }

    public void loadAlerts() {
        alertsLiveData.setValue(alertRepository.getAlerts());
    }
}
