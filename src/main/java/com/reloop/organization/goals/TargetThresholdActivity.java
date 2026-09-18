package com.reloop.organization.goals;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.reloopai.databinding.ActivityTargetThresholdBinding;
import com.reloop.organization.model.ResourceGoal;

public class TargetThresholdActivity extends AppCompatActivity {

    private ActivityTargetThresholdBinding binding;
    private TargetThresholdViewModel viewModel;
    private String resourceId = "res_1";
    private ResourceGoal currentGoal;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityTargetThresholdBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        if (getIntent().hasExtra("EXTRA_RESOURCE_ID")) {
            resourceId = getIntent().getStringExtra("EXTRA_RESOURCE_ID");
        }

        viewModel = new ViewModelProvider(this).get(TargetThresholdViewModel.class);

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        viewModel.getGoal().observe(this, new Observer<ResourceGoal>() {
            @Override
            public void onChanged(ResourceGoal goal) {
                if (goal == null) return;
                currentGoal = goal;
                binding.tvTargetSubHeader.setText(goal.getResourceType() + " • " + goal.getDepartment() + " • measured in " + goal.getUnit() + " per month.");

                binding.etMonthlyTarget.setText(String.format("%,.0f", goal.getMonthlyTarget()));
                binding.etMaxThreshold.setText(String.format("%,.0f", goal.getMaximumThreshold()));

                binding.sbTarget.setProgress((int) goal.getMonthlyTarget());
                binding.sbThreshold.setProgress((int) goal.getMaximumThreshold());

                binding.switchWarnThreshold.setChecked(goal.isPushAlertsEnabled());
                binding.switchAIPredictedBreach.setChecked(goal.isAiPredictiveAlertsEnabled());
            }
        });

        viewModel.getSaveSuccess().observe(this, new Observer<Boolean>() {
            @Override
            public void onChanged(Boolean success) {
                if (Boolean.TRUE.equals(success)) {
                    Toast.makeText(TargetThresholdActivity.class.cast(TargetThresholdActivity.this), "Configuration saved successfully", Toast.LENGTH_SHORT).show();
                    finish();
                }
            }
        });

        binding.btnSaveConfiguration.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (currentGoal != null) {
                    currentGoal.setPushAlertsEnabled(binding.switchWarnThreshold.isChecked());
                    currentGoal.setAiPredictiveAlertsEnabled(binding.switchAIPredictedBreach.isChecked());
                    viewModel.saveGoal(currentGoal);
                }
            }
        });

        viewModel.loadGoal(resourceId);
    }
}
