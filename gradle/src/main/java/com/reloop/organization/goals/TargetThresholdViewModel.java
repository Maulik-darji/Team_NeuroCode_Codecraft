package com.reloop.organization.goals;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.ResourceGoal;
import com.reloop.organization.repository.GoalRepository;

public class TargetThresholdViewModel extends ViewModel {

    private final GoalRepository goalRepository;
    private final MutableLiveData<ResourceGoal> goalLiveData = new MutableLiveData<>();
    private final MutableLiveData<Boolean> saveSuccessLiveData = new MutableLiveData<>();

    public TargetThresholdViewModel() {
        this.goalRepository = new GoalRepository();
    }

    public LiveData<ResourceGoal> getGoal() {
        return goalLiveData;
    }

    public LiveData<Boolean> getSaveSuccess() {
        return saveSuccessLiveData;
    }

    public void loadGoal(String resourceId) {
        goalLiveData.setValue(goalRepository.getGoalForResource(resourceId));
    }

    public void saveGoal(ResourceGoal goal) {
        boolean success = goalRepository.updateGoal(goal);
        saveSuccessLiveData.setValue(success);
    }
}
