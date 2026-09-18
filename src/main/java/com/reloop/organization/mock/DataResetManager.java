package com.reloop.organization.mock;

import android.content.Context;
import android.content.SharedPreferences;

public class DataResetManager {

    private static final String PREF_NAME = "reloop_org_data_prefs";
    private static final String KEY_CLEAN_SLATE = "key_clean_slate_enabled";

    private final SharedPreferences prefs;

    public DataResetManager(Context context) {
        this.prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public boolean isCleanSlateEnabled() {
        return prefs.getBoolean(KEY_CLEAN_SLATE, true); // Default to clean slate mode as requested by user
    }

    public void setCleanSlateEnabled(boolean enabled) {
        prefs.edit().putBoolean(KEY_CLEAN_SLATE, enabled).apply();
    }

    public void resetDataToCleanSlate() {
        setCleanSlateEnabled(true);
    }
}
