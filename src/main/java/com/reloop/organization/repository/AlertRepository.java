package com.reloop.organization.repository;

import com.reloop.organization.mock.OrganizationMockData;
import com.reloop.organization.model.OrgAlert;

import java.util.List;

public class AlertRepository {
    public List<OrgAlert> getAlerts() {
        return OrganizationMockData.getMockAlerts();
    }
}
