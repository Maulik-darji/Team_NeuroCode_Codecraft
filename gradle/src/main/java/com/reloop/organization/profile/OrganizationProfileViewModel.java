package com.reloop.organization.profile;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.reloop.organization.model.OrgProfile;
import com.reloop.organization.repository.OrganizationRepository;

public class OrganizationProfileViewModel extends ViewModel {

    private final OrganizationRepository organizationRepository;
    private final MutableLiveData<OrgProfile> profileLiveData = new MutableLiveData<>();

    public OrganizationProfileViewModel() {
        this.organizationRepository = new OrganizationRepository();
    }

    public LiveData<OrgProfile> getProfile() {
        return profileLiveData;
    }

    public void loadProfile() {
        profileLiveData.setValue(organizationRepository.getProfile());
    }
}
