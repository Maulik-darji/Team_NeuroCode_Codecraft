package com.reloop.organization.alerts;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.reloopai.databinding.ActivityOrganizationAlertsBinding;
import com.reloop.organization.model.OrgAlert;
import com.reloop.organization.recommendation.AIRecommendationActivity;

import java.util.List;

public class OrganizationAlertsActivity extends AppCompatActivity {

    private ActivityOrganizationAlertsBinding binding;
    private OrganizationAlertsViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOrganizationAlertsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(OrganizationAlertsViewModel.class);

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.btnBannerRecommendation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationAlertsActivity.this, AIRecommendationActivity.class));
            }
        });

        binding.btnBannerSnooze.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationAlertsActivity.this, "Alert snoozed for 24 hours", Toast.LENGTH_SHORT).show();
            }
        });

        binding.rvAlerts.setLayoutManager(new LinearLayoutManager(this));

        viewModel.getAlerts().observe(this, new Observer<List<OrgAlert>>() {
            @Override
            public void onChanged(List<OrgAlert> list) {
                if (list != null) {
                    AlertsAdapter adapter = new AlertsAdapter(list);
                    binding.rvAlerts.setAdapter(adapter);
                }
            }
        });

        viewModel.loadAlerts();
    }
}
