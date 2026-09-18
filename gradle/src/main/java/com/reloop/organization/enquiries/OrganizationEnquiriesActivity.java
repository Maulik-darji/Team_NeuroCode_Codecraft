package com.reloop.organization.enquiries;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.reloopai.R;
import com.example.reloopai.databinding.ActivityOrganizationEnquiriesBinding;

public class OrganizationEnquiriesActivity extends AppCompatActivity {

    private ActivityOrganizationEnquiriesBinding binding;
    private OrganizationEnquiriesViewModel viewModel;
    private EnquiriesAdapter adapter;
    private String selectedTab = "NEW";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOrganizationEnquiriesBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(OrganizationEnquiriesViewModel.class);

        setupUI();
        observeViewModel();
    }

    private void setupUI() {
        binding.btnBack.setOnClickListener(v -> finish());

        // Setup RecyclerView
        binding.rvEnquiries.setLayoutManager(new LinearLayoutManager(this));
        adapter = new EnquiriesAdapter(new EnquiriesAdapter.OnEnquiryActionListener() {
            @Override
            public void onDecline(OrgEnquiry enquiry) {
                viewModel.declineEnquiry(enquiry);
            }

            @Override
            public void onRespond(OrgEnquiry enquiry) {
                Toast.makeText(OrganizationEnquiriesActivity.this,
                        "Opening negotiation with " + enquiry.getBuyerName(),
                        Toast.LENGTH_SHORT).show();
            }
        });
        binding.rvEnquiries.setAdapter(adapter);

        // Sub-tabs listeners
        binding.tabNew.setOnClickListener(v -> selectTab("NEW"));
        binding.tabInTalks.setOnClickListener(v -> selectTab("IN_TALKS"));
        binding.tabCompleted.setOnClickListener(v -> selectTab("COMPLETED"));

        updateTabStyles();
    }

    private void selectTab(String tab) {
        this.selectedTab = tab;
        updateTabStyles();
        viewModel.loadCategory(tab);
    }

    private void updateTabStyles() {
        int forestColor = ContextCompat.getColor(this, R.color.org_primary_forest);
        int mutedColor = ContextCompat.getColor(this, R.color.org_text_muted);

        binding.tabNew.setTextColor("NEW".equalsIgnoreCase(selectedTab) ? forestColor : mutedColor);
        binding.tabInTalks.setTextColor("IN_TALKS".equalsIgnoreCase(selectedTab) ? forestColor : mutedColor);
        binding.tabCompleted.setTextColor("COMPLETED".equalsIgnoreCase(selectedTab) ? forestColor : mutedColor);
    }

    private void observeViewModel() {
        viewModel.getEnquiriesLiveData().observe(this, list -> {
            if (list == null || list.isEmpty()) {
                binding.containerEmptyState.setVisibility(View.VISIBLE);
                binding.rvEnquiries.setVisibility(View.GONE);
            } else {
                binding.containerEmptyState.setVisibility(View.GONE);
                binding.rvEnquiries.setVisibility(View.VISIBLE);
                adapter.setEnquiries(list);
            }
        });

        viewModel.getActionMessageLiveData().observe(this, msg -> {
            if (msg != null && !msg.isEmpty()) {
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
