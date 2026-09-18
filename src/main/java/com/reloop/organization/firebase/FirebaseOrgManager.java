package com.reloop.organization.firebase;

import android.content.Context;
import android.util.Log;

import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;

public class FirebaseOrgManager {

    private static final String TAG = "FirebaseOrgManager";
    private static final String DEFAULT_ORG_ID = "shivalik_textiles_01";
    private static FirebaseOrgManager instance;

    private FirebaseFirestore db;
    private FirebaseStorage storage;
    private boolean isInitialized = false;

    private FirebaseOrgManager() {
        try {
            db = FirebaseFirestore.getInstance();
            storage = FirebaseStorage.getInstance();
            isInitialized = true;
            Log.d(TAG, "Firebase initialized successfully for Organization module.");
        } catch (Exception e) {
            Log.w(TAG, "Firebase initialization warning: " + e.getMessage() + ". Operating in offline / local data mode.");
            isInitialized = false;
        }
    }

    public static synchronized FirebaseOrgManager getInstance() {
        if (instance == null) {
            instance = new FirebaseOrgManager();
        }
        return instance;
    }

    public boolean isInitialized() {
        return isInitialized;
    }

    public FirebaseFirestore getDb() {
        return db;
    }

    public FirebaseStorage getStorage() {
        return storage;
    }

    public String getDefaultOrgId() {
        return DEFAULT_ORG_ID;
    }
}
