package com.reloop.organization.sustainability;

import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.reloopai.databinding.ActivitySustainabilityOverviewBinding;
import com.reloop.organization.model.SustainabilityMetrics;

public class SustainabilityOverviewActivity extends AppCompatActivity {

    private ActivitySustainabilityOverviewBinding binding;
    private SustainabilityViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySustainabilityOverviewBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(SustainabilityViewModel.class);

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        viewModel.getMetrics().observe(this, new Observer<SustainabilityMetrics>() {
            @Override
            public void onChanged(SustainabilityMetrics metrics) {
                if (metrics == null) return;
                binding.tvOverallScore.setText(metrics.getOverallScore() + " / 100");
                binding.tvResourceEfficiencyScore.setText(String.valueOf(metrics.getResourceEfficiencyScore()));
                binding.tvReuseScore.setText(String.valueOf(metrics.getReuseScore()));
                binding.tvRecyclingScore.setText(String.valueOf(metrics.getRecyclingScore()));
                binding.tvGoalAchievementScore.setText(String.valueOf(metrics.getGoalAchievementScore()));

                binding.tvEnergySaved.setText(metrics.getEnergySavedDisplay());
                binding.tvItemsReused.setText(metrics.getItemsReusedCount() + " assets");
                binding.tvItemsRecycled.setText(metrics.getItemsRecycledCount() + " kg");
                binding.tvCostSavings.setText(metrics.getEstimatedCostSavings());
                binding.tvCo2Avoided.setText(metrics.getCo2ReducedDisplay());
            }
        });

        viewModel.loadMetrics();
    }
}
