package com.reloop.organization.contracts;

import android.content.Context;

public interface GlobalNavigationContract {
    void switchToRegularUserMode(Context context);
    void switchToRRRMode(Context context);
    void navigateToGlobalTab(Context context, String tabName);
}
