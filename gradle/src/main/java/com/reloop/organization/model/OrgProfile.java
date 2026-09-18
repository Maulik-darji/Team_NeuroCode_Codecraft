package com.reloop.organization.model;

public class OrgProfile {
    private String organizationName;
    private String unitName;
    private String orgType; // Textile Manufacturing
    private String verificationStatus; // Verified Corporate
    private String contactPerson;
    private String email;
    private String location;
    private int sustainabilityScore;
    private int trackedResourcesCount;

    public OrgProfile(String organizationName, String unitName, String orgType, String verificationStatus, String contactPerson, String email, String location, int sustainabilityScore, int trackedResourcesCount) {
        this.organizationName = organizationName;
        this.unitName = unitName;
        this.orgType = orgType;
        this.verificationStatus = verificationStatus;
        this.contactPerson = contactPerson;
        this.email = email;
        this.location = location;
        this.sustainabilityScore = sustainabilityScore;
        this.trackedResourcesCount = trackedResourcesCount;
    }

    public String getOrganizationName() { return organizationName; }
    public String getUnitName() { return unitName; }
    public String getOrgType() { return orgType; }
    public String getVerificationStatus() { return verificationStatus; }
    public String getContactPerson() { return contactPerson; }
    public String getEmail() { return email; }
    public String getLocation() { return location; }
    public int getSustainabilityScore() { return sustainabilityScore; }
    public int getTrackedResourcesCount() { return trackedResourcesCount; }
}
