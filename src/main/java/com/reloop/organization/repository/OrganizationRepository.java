package com.reloop.organization.repository;

import com.reloop.organization.mock.OrganizationMockData;
import com.reloop.organization.model.OrgProfile;
import com.reloop.organization.model.OrgSummary;
import com.reloop.organization.model.SustainabilityMetrics;

public class OrganizationRepository {
    public OrgSummary getSummary() {
        return OrganizationMockData.getMockSummary();
    }

    public SustainabilityMetrics getSustainabilityMetrics() {
        return OrganizationMockData.getMockSustainabilityMetrics();
    }

    public OrgProfile getProfile() {
        return OrganizationMockData.getMockProfile();
    }
}
