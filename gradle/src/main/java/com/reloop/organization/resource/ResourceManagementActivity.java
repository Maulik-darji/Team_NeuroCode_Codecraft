package com.reloop.organization.resource;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.reloopai.databinding.ActivityResourceManagementBinding;
import com.reloop.organization.model.TrackedResource;

import java.util.List;

public class ResourceManagementActivity extends AppCompatActivity {

    private ActivityResourceManagementBinding binding;
    private ResourceManagementViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityResourceManagementBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(ResourceManagementViewModel.class);

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.btnFilter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(ResourceManagementActivity.this, "Filter resources by unit/status", Toast.LENGTH_SHORT).show();
            }
        });

        binding.rvResources.setLayoutManager(new LinearLayoutManager(this));

        viewModel.getResources().observe(this, new Observer<List<TrackedResource>>() {
            @Override
            public void onChanged(List<TrackedResource> list) {
                if (list == null || list.isEmpty()) {
                    binding.containerEmptyState.setVisibility(View.VISIBLE);
                    binding.rvResources.setVisibility(View.GONE);
                } else {
                    binding.containerEmptyState.setVisibility(View.GONE);
                    binding.rvResources.setVisibility(View.VISIBLE);
                    ResourceAdapter adapter = new ResourceAdapter(list, new ResourceAdapter.OnResourceClickListener() {
                        @Override
                        public void onResourceClick(TrackedResource resource) {
                            Intent intent = new Intent(ResourceManagementActivity.this, ResourceDetailActivity.class);
                            intent.putExtra("EXTRA_RESOURCE_ID", resource.getId());
                            startActivity(intent);
                        }
                    });
                    binding.rvResources.setAdapter(adapter);
                }
            }
        });

        viewModel.loadResources();
    }
}
