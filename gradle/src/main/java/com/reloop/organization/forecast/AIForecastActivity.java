package com.reloop.organization.forecast;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.reloopai.databinding.ActivityAiForecastBinding;
import com.reloop.organization.model.ForecastResult;
import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.recommendation.AIRecommendationActivity;

import java.util.List;

public class AIForecastActivity extends AppCompatActivity {

    private ActivityAiForecastBinding binding;
    private AIForecastViewModel viewModel;
    private String resourceId = "res_1";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAiForecastBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        if (getIntent().hasExtra("EXTRA_RESOURCE_ID")) {
            resourceId = getIntent().getStringExtra("EXTRA_RESOURCE_ID");
        }

        viewModel = new ViewModelProvider(this).get(AIForecastViewModel.class);

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.btnNavToRecommendations.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AIForecastActivity.this, AIRecommendationActivity.class);
                intent.putExtra("EXTRA_RESOURCE_ID", resourceId);
                startActivity(intent);
            }
        });

        viewModel.getForecast().observe(this, new Observer<ForecastResult>() {
            @Override
            public void onChanged(ForecastResult result) {
                if (result == null) return;
                binding.tvForecastSummaryText.setText(result.getRecommendationSummary());
                binding.tvCurrentUsage.setText(String.format("%,.0f kWh", result.getCurrentUsage()));
                binding.tvPredictedUsage.setText(String.format("%,.0f kWh", result.getPredictedUsage()));
                binding.tvRiskBadge.setText("RISK: " + result.getRiskLevel());
            }
        });

        viewModel.getHistory().observe(this, new Observer<List<HistoricalConsumption>>() {
            @Override
            public void onChanged(List<HistoricalConsumption> history) {
                if (history != null) {
                    binding.chartAIForecast.setData(history);
                }
            }
        });

        viewModel.loadForecast(resourceId);
    }
}
