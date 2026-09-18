package com.reloop.organization.contracts;

import android.content.Context;

public interface MarketplaceNavigationContract {
    void openBulkMarketplace(Context context);
    void openSurplusListings(Context context);
    void openEnquiriesings(Context context);
    void openOffersings(Context context);
}
