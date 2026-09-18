package com.reloop.organization.resource;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.reloopai.databinding.ActivityConsumptionHistoryBinding;
import com.reloop.organization.model.HistoricalConsumption;

import java.util.List;

public class ConsumptionHistoryActivity extends AppCompatActivity {

    private ActivityConsumptionHistoryBinding binding;
    private ConsumptionHistoryViewModel viewModel;
    private String resourceId = "res_1";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityConsumptionHistoryBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        if (getIntent().hasExtra("EXTRA_RESOURCE_ID")) {
            resourceId = getIntent().getStringExtra("EXTRA_RESOURCE_ID");
        }

        viewModel = new ViewModelProvider(this).get(ConsumptionHistoryViewModel.class);

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.rvHistory.setLayoutManager(new LinearLayoutManager(this));

        viewModel.getHistory().observe(this, new Observer<List<HistoricalConsumption>>() {
            @Override
            public void onChanged(List<HistoricalConsumption> list) {
                if (list != null) {
                    binding.chartConsumptionHistory.setData(list);
                    ConsumptionAdapter adapter = new ConsumptionAdapter(list);
                    binding.rvHistory.setAdapter(adapter);
                }
            }
        });

        setupTabClickListeners();
        viewModel.loadHistory(resourceId);
    }

    private void setupTabClickListeners() {
        binding.tabDaily.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(ConsumptionHistoryActivity.this, "Switched to Daily view", Toast.LENGTH_SHORT).show();
            }
        });
        binding.tabWeekly.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(ConsumptionHistoryActivity.this, "Switched to Weekly view", Toast.LENGTH_SHORT).show();
            }
        });
        binding.tabMonthly.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(ConsumptionHistoryActivity.this, "Showing Monthly view", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
