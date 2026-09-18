package com.reloop.organization.firebase;

import android.util.Log;

import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;

import com.reloop.organization.model.TrackedResource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FirebaseResourceRepository {

    private static final String TAG = "FirebaseResourceRepo";

    public interface OnResourcesLoadedListener {
        void onLoaded(List<TrackedResource> resources);
        void onError(Exception e);
    }

    public interface OnSaveCompleteListener {
        void onSuccess();
        void onFailure(Exception e);
    }

    public void fetchResources(String orgId, OnResourcesLoadedListener listener) {
        FirebaseOrgManager manager = FirebaseOrgManager.getInstance();
        if (!manager.isInitialized() || manager.getDb() == null) {
            if (listener != null) listener.onLoaded(new ArrayList<>());
            return;
        }

        CollectionReference ref = manager.getDb()
                .collection("organizations")
                .document(orgId)
                .collection("resources");

        ref.get().addOnCompleteListener(task -> {
            if (task.isSuccessful() && task.getResult() != null) {
                List<TrackedResource> list = new ArrayList<>();
                for (DocumentSnapshot doc : task.getResult()) {
                    try {
                        String id = doc.getId();
                        String name = doc.getString("name");
                        String unit = doc.getString("unit");
                        Double current = doc.getDouble("currentConsumption");
                        Double limit = doc.getDouble("limit");
                        Double warning = doc.getDouble("warningThresholdPercent");
                        String status = doc.getString("status");
                        String dept = doc.getString("department");
                        Double pred = doc.getDouble("predictedConsumption");
                        Double trend = doc.getDouble("trendChangePercent");

                        if (name != null) {
                            list.add(new TrackedResource(
                                    id, name, unit != null ? unit : "units",
                                    current != null ? current : 0.0,
                                    limit != null ? limit : 100.0,
                                    warning != null ? warning : 80.0,
                                    status != null ? status : "SAFE",
                                    dept != null ? dept : "Main Unit",
                                    pred != null ? pred : 0.0,
                                    trend != null ? trend : 0.0
                            ));
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing resource doc: " + doc.getId(), e);
                    }
                }
                if (listener != null) listener.onLoaded(list);
            } else {
                if (listener != null) listener.onError(task.getException());
            }
        });
    }

    public void saveResource(String orgId, TrackedResource resource, OnSaveCompleteListener listener) {
        FirebaseOrgManager manager = FirebaseOrgManager.getInstance();
        if (!manager.isInitialized() || manager.getDb() == null) {
            if (listener != null) listener.onSuccess();
            return;
        }

        Map<String, Object> map = new HashMap<>();
        map.put("name", resource.getName());
        map.put("unit", resource.getUnit());
        map.put("currentConsumption", resource.getCurrentConsumption());
        map.put("limit", resource.getLimit());
        map.put("warningThresholdPercent", resource.getWarningThresholdPercent());
        map.put("status", resource.getStatus());
        map.put("department", resource.getDepartment());
        map.put("predictedConsumption", resource.getPredictedConsumption());
        map.put("trendChangePercent", resource.getTrendChangePercent());

        manager.getDb().collection("organizations")
                .document(orgId)
                .collection("resources")
                .document(resource.getId())
                .set(map)
                .addOnSuccessListener(aVoid -> {
                    if (listener != null) listener.onSuccess();
                })
                .addOnFailureListener(e -> {
                    if (listener != null) listener.onFailure(e);
                });
    }
}
