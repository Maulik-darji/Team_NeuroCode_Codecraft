package com.reloop.organization.marketplace;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.reloopai.databinding.ActivityOrganizationSurplusMarketplaceBinding;
import com.reloop.organization.profile.OrganizationProfileActivity;

import java.util.List;

public class OrganizationSurplusMarketplaceActivity extends AppCompatActivity {

    private ActivityOrganizationSurplusMarketplaceBinding binding;
    private OrganizationMarketplaceViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOrganizationSurplusMarketplaceBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(OrganizationMarketplaceViewModel.class);

        setupRecyclerViews();
        setupClickListeners();
        setupSearchListener();
        setupObservers();

        viewModel.loadData();
    }

    @Override
    protected void onResume() {
        super.onResume();
        viewModel.loadData();
    }

    private void setupRecyclerViews() {
        binding.rvFilterChips.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        binding.rvCategories.setLayoutManager(new GridLayoutManager(this, 3));
        binding.rvListings.setLayoutManager(new LinearLayoutManager(this));
    }

    private void setupClickListeners() {
        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.btnNavToListAsset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationSurplusMarketplaceActivity.this, OrganizationListAssetActivity.class));
            }
        });

        binding.ivProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationSurplusMarketplaceActivity.this, OrganizationProfileActivity.class));
            }
        });

        binding.btnTabRegular.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationSurplusMarketplaceActivity.this, "Contract: Regular User Marketplace owned by User Team", Toast.LENGTH_SHORT).show();
            }
        });

        binding.tvLocationDisplay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationSurplusMarketplaceActivity.this, "Location selector: Surat, Gujarat", Toast.LENGTH_SHORT).show();
            }
        });

        binding.tvSortDropdown.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationSurplusMarketplaceActivity.this, "Sort by: Recommended", Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnClearFilters.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                binding.etSearchQuery.setText("");
                viewModel.clearFilters();
            }
        });
    }

    private void setupSearchListener() {
        binding.etSearchQuery.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                viewModel.setSearchQuery(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void setupObservers() {
        viewModel.getFilterChips().observe(this, new Observer<List<MarketplaceFilterChip>>() {
            @Override
            public void onChanged(List<MarketplaceFilterChip> chips) {
                if (chips != null) {
                    MarketplaceFilterAdapter adapter = new MarketplaceFilterAdapter(chips, new MarketplaceFilterAdapter.OnFilterChipClickListener() {
                        @Override
                        public void onFilterChipClick(MarketplaceFilterChip chip) {
                            viewModel.toggleFilterChip(chip.getId());
                        }
                    });
                    binding.rvFilterChips.setAdapter(adapter);
                }
            }
        });

        viewModel.getCategories().observe(this, new Observer<List<MarketplaceCategory>>() {
            @Override
            public void onChanged(List<MarketplaceCategory> categories) {
                if (categories != null) {
                    MarketplaceCategoryAdapter adapter = new MarketplaceCategoryAdapter(categories, new MarketplaceCategoryAdapter.OnCategoryClickListener() {
                        @Override
                        public void onCategoryClick(MarketplaceCategory category) {
                            viewModel.selectCategory(category.getName());
                        }
                    });
                    binding.rvCategories.setAdapter(adapter);
                }
            }
        });

        viewModel.getListings().observe(this, new Observer<List<OrganizationMarketplaceItem>>() {
            @Override
            public void onChanged(List<OrganizationMarketplaceItem> listings) {
                if (listings == null || listings.isEmpty()) {
                    binding.containerEmptyState.setVisibility(View.VISIBLE);
                    binding.rvListings.setVisibility(View.GONE);
                } else {
                    binding.containerEmptyState.setVisibility(View.GONE);
                    binding.rvListings.setVisibility(View.VISIBLE);

                    OrganizationMarketplaceAdapter adapter = new OrganizationMarketplaceAdapter(listings, new OrganizationMarketplaceAdapter.OnListingClickListener() {
                        @Override
                        public void onListingClick(OrganizationMarketplaceItem item) {
                            Toast.makeText(OrganizationSurplusMarketplaceActivity.this, "Marketplace Listing Contract: Opened " + item.getTitle(), Toast.LENGTH_SHORT).show();
                        }
                    });
                    binding.rvListings.setAdapter(adapter);
                }
            }
        });
    }
}
