package com.reloop.organization.contracts;

public interface UserRepositoryContract {
    String getCurrentUserName();
    String getCurrentOrganizationName();
    String getCurrentUnitName();
    boolean isOrganizationUser();
}
