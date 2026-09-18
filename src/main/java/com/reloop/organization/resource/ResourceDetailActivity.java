package com.reloop.organization.resource;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.reloopai.databinding.ActivityResourceDetailBinding;
import com.reloop.organization.goals.TargetThresholdActivity;
import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.model.TrackedResource;
import com.reloop.organization.recommendation.AIRecommendationActivity;

import java.util.List;

public class ResourceDetailActivity extends AppCompatActivity {

    private ActivityResourceDetailBinding binding;
    private ResourceDetailViewModel viewModel;
    private String resourceId = "res_1";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityResourceDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        if (getIntent().hasExtra("EXTRA_RESOURCE_ID")) {
            resourceId = getIntent().getStringExtra("EXTRA_RESOURCE_ID");
        }

        viewModel = new ViewModelProvider(this).get(ResourceDetailViewModel.class);

        setupClickListeners();
        setupObservers();

        viewModel.loadResource(resourceId);
    }

    private void setupObservers() {
        viewModel.getResource().observe(this, new Observer<TrackedResource>() {
            @Override
            public void onChanged(TrackedResource resource) {
                if (resource == null) return;
                binding.tvResourceTitle.setText(resource.getName());
                binding.tvResourceSubTitle.setText(resource.getDepartment() + " • " + resource.getUnit() + " • monthly");

                binding.tvPlannedToDate.setText("74,500 " + resource.getUnit());
                binding.tvActualToDate.setText(String.format("%,.0f %s", resource.getCurrentConsumption(), resource.getUnit()));
                binding.tvRemainingAllowance.setText(String.format("%,.0f %s", (resource.getLimit() - resource.getCurrentConsumption()), resource.getUnit()));
                binding.tvDailyAverage.setText("4,556 " + resource.getUnit());
                binding.tvTrendVsAugust.setText(String.format("▲ %.1f%%", resource.getTrendChangePercent()));
                double target = resource.getLimit() * 0.9; // 90% target marker
                binding.tvMainMetricDisplay.setText(String.format("%,.0f %s used · 18 days in", resource.getCurrentConsumption(), resource.getUnit()));
                binding.pbGaugeUsage.setMax((int) resource.getLimit());
                binding.pbGaugeUsage.setProgress((int) resource.getCurrentConsumption());
                binding.tvGaugeTargetLabel.setText(String.format("Target %,.0f", target));
                binding.tvGaugeThresholdLabel.setText(String.format("Threshold %,.0f", resource.getLimit()));
                binding.tvDetailStatus.setText(resource.getStatus());
            }
        });

        viewModel.getHistory().observe(this, new Observer<List<HistoricalConsumption>>() {
            @Override
            public void onChanged(List<HistoricalConsumption> list) {
                if (list != null) {
                    binding.barChartViewHistory.setData(list);
                }
            }
        });
    }

    private void setupClickListeners() {
        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.btnEditThreshold.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ResourceDetailActivity.this, TargetThresholdActivity.class);
                intent.putExtra("EXTRA_RESOURCE_ID", resourceId);
                startActivity(intent);
            }
        });

        binding.btnViewAllAIRecommendations.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(ResourceDetailActivity.this, AIRecommendationActivity.class));
            }
        });

        binding.btnViewFullHistory.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ResourceDetailActivity.this, ConsumptionHistoryActivity.class);
                intent.putExtra("EXTRA_RESOURCE_ID", resourceId);
                startActivity(intent);
            }
        });
    }
}
