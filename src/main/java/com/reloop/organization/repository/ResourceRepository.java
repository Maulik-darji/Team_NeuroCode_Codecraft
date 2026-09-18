package com.reloop.organization.repository;

import com.reloop.organization.mock.OrganizationMockData;
import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.model.TrackedResource;

import java.util.List;

public class ResourceRepository {
    public List<TrackedResource> getAllResources() {
        return OrganizationMockData.getMockResources();
    }

    public TrackedResource getResourceById(String id) {
        return OrganizationMockData.getResourceById(id);
    }

    public List<HistoricalConsumption> getConsumptionHistory(String resourceId) {
        return OrganizationMockData.getMockHistory();
    }
}
