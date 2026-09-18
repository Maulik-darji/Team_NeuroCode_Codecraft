package com.reloop.organization.recommendation;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.reloopai.databinding.ActivityAiRecommendationBinding;
import com.reloop.organization.model.AIRecommendation;

import java.util.List;

public class AIRecommendationActivity extends AppCompatActivity {

    private ActivityAiRecommendationBinding binding;
    private AIRecommendationViewModel viewModel;
    private String resourceId = "res_1";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAiRecommendationBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        if (getIntent().hasExtra("EXTRA_RESOURCE_ID")) {
            resourceId = getIntent().getStringExtra("EXTRA_RESOURCE_ID");
        }

        viewModel = new ViewModelProvider(this).get(AIRecommendationViewModel.class);

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.rvRecommendations.setLayoutManager(new LinearLayoutManager(this));

        viewModel.getRecommendations().observe(this, new Observer<List<AIRecommendation>>() {
            @Override
            public void onChanged(List<AIRecommendation> list) {
                if (list != null) {
                    RecommendationAdapter adapter = new RecommendationAdapter(list, new RecommendationAdapter.OnRecommendationActionListener() {
                        @Override
                        public void onApplyRecommendation(AIRecommendation rec) {
                            viewModel.applyRecommendation(rec.getId());
                            Toast.makeText(AIRecommendationActivity.this, "Applied action: " + rec.getTitle(), Toast.LENGTH_SHORT).show();
                        }
                    });
                    binding.rvRecommendations.setAdapter(adapter);
                }
            }
        });

        viewModel.loadRecommendations(resourceId);
    }
}
