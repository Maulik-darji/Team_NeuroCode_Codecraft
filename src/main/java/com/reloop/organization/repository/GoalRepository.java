package com.reloop.organization.repository;

import com.reloop.organization.mock.OrganizationMockData;
import com.reloop.organization.model.ResourceGoal;

public class GoalRepository {
    public ResourceGoal getGoalForResource(String resourceId) {
        return OrganizationMockData.getMockGoal(resourceId);
    }

    public boolean updateGoal(ResourceGoal goal) {
        // Mock save implementation
        return true;
    }
}
