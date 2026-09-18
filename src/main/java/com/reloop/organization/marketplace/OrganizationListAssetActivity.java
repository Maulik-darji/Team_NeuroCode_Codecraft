package com.reloop.organization.marketplace;

import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.reloopai.R;
import com.example.reloopai.databinding.ActivityOrganizationListAssetBinding;
import com.example.reloopai.databinding.DialogOrgListingPreviewBinding;
import com.google.android.material.bottomsheet.BottomSheetDialog;

import java.util.List;

public class OrganizationListAssetActivity extends AppCompatActivity {

    private ActivityOrganizationListAssetBinding binding;
    private OrganizationListAssetViewModel viewModel;
    private MediaUploadAdapter mediaAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOrganizationListAssetBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(OrganizationListAssetViewModel.class);

        setupSpinners();
        setupRecyclerView();
        setupClickListeners();
        setupObservers();
    }

    private void setupSpinners() {
        String[] categories = new String[]{"Machinery", "Materials", "Furniture", "Electrical", "Industrial", "Scrap"};
        ArrayAdapter<String> catAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories);
        binding.spCategory.setAdapter(catAdapter);

        String[] conditions = new String[]{"Working · Refurbished", "Working · Used", "New", "Good", "Recyclable", "For parts"};
        ArrayAdapter<String> condAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, conditions);
        binding.spCondition.setAdapter(condAdapter);

        String[] units = new String[]{"units", "sets", "kg", "tonnes", "litres", "pieces", "machines"};
        ArrayAdapter<String> unitAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, units);
        binding.spUnit.setAdapter(unitAdapter);

        String[] fulfillments = new String[]{"Buyer pickup · Delivery on request", "Buyer pickup", "Delivery available", "Delivery on request"};
        ArrayAdapter<String> fulAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, fulfillments);
        binding.spFulfillment.setAdapter(fulAdapter);
    }

    private void setupRecyclerView() {
        binding.rvMediaThumbnails.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
    }

    private void setupClickListeners() {
        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.btnAddPhoto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewModel.addMockPhoto();
            }
        });

        binding.chipIntentSell.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewModel.setIntent("SELL");
            }
        });

        binding.chipIntentGiveAway.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewModel.setIntent("GIVE AWAY");
            }
        });

        binding.chipIntentReuse.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewModel.setIntent("REUSE");
            }
        });

        binding.chipIntentRecycle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewModel.setIntent("RECYCLE");
            }
        });

        binding.btnPreview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showPreviewBottomSheet();
            }
        });

        binding.btnPublishListing.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewModel.validateAndPublish(
                        binding.etAssetTitle.getText().toString(),
                        binding.spCategory.getSelectedItem().toString(),
                        binding.spCondition.getSelectedItem().toString(),
                        binding.etQuantity.getText().toString(),
                        binding.spUnit.getSelectedItem().toString(),
                        binding.etMinimumOrder.getText().toString(),
                        binding.etPrice.getText().toString(),
                        binding.switchNegotiable.isChecked(),
                        binding.spFulfillment.getSelectedItem().toString(),
                        binding.etDescription.getText().toString()
                );
            }
        });
    }

    private void setupObservers() {
        viewModel.getMediaList().observe(this, new Observer<List<String>>() {
            @Override
            public void onChanged(List<String> list) {
                if (list != null) {
                    mediaAdapter = new MediaUploadAdapter(list, new MediaUploadAdapter.OnMediaRemoveClickListener() {
                        @Override
                        public void onRemoveMedia(int position) {
                            viewModel.removePhoto(position);
                        }
                    });
                    binding.rvMediaThumbnails.setAdapter(mediaAdapter);
                }
            }
        });

        viewModel.getSelectedIntent().observe(this, new Observer<String>() {
            @Override
            public void onChanged(String intent) {
                updateIntentChipStyles(intent);
            }
        });

        viewModel.getValidationError().observe(this, new Observer<String>() {
            @Override
            public void onChanged(String error) {
                if (error != null && !error.isEmpty()) {
                    Toast.makeText(OrganizationListAssetActivity.this, error, Toast.LENGTH_LONG).show();
                }
            }
        });

        viewModel.getPublishSuccess().observe(this, new Observer<Boolean>() {
            @Override
            public void onChanged(Boolean success) {
                if (Boolean.TRUE.equals(success)) {
                    Toast.makeText(OrganizationListAssetActivity.this, "Surplus asset published to Organization Marketplace!", Toast.LENGTH_SHORT).show();
                    finish();
                }
            }
        });
    }

    private void updateIntentChipStyles(String intent) {
        resetIntentChip(binding.chipIntentSell);
        resetIntentChip(binding.chipIntentGiveAway);
        resetIntentChip(binding.chipIntentReuse);
        resetIntentChip(binding.chipIntentRecycle);

        if ("SELL".equalsIgnoreCase(intent)) {
            selectIntentChip(binding.chipIntentSell);
            binding.containerPricing.setVisibility(View.VISIBLE);
        } else if ("GIVE AWAY".equalsIgnoreCase(intent)) {
            selectIntentChip(binding.chipIntentGiveAway);
            binding.containerPricing.setVisibility(View.GONE);
        } else if ("REUSE".equalsIgnoreCase(intent)) {
            selectIntentChip(binding.chipIntentReuse);
            binding.containerPricing.setVisibility(View.GONE);
        } else if ("RECYCLE".equalsIgnoreCase(intent)) {
            selectIntentChip(binding.chipIntentRecycle);
            binding.containerPricing.setVisibility(View.GONE);
        }
    }

    private void selectIntentChip(android.widget.TextView view) {
        view.setBackgroundResource(R.drawable.bg_org_button_forest);
        view.setTextColor(ContextCompat.getColor(this, R.color.org_surface_white));
    }

    private void resetIntentChip(android.widget.TextView view) {
        view.setBackgroundResource(R.drawable.bg_org_button_outline);
        view.setTextColor(ContextCompat.getColor(this, R.color.org_text_charcoal));
    }

    private void showPreviewBottomSheet() {
        BottomSheetDialog dialog = new BottomSheetDialog(this);
        DialogOrgListingPreviewBinding previewBinding = DialogOrgListingPreviewBinding.inflate(getLayoutInflater());
        dialog.setContentView(previewBinding.getRoot());

        String title = binding.etAssetTitle.getText().toString();
        previewBinding.tvPreviewTitle.setText(title.isEmpty() ? "Lakshmi Rieter G32 ring frame" : title);

        String intent = viewModel.getSelectedIntent().getValue();
        previewBinding.tvPreviewIntentBadge.setText(intent);

        String priceStr = binding.etPrice.getText().toString();
        if ("GIVE AWAY".equalsIgnoreCase(intent) || priceStr.isEmpty()) {
            previewBinding.tvPreviewPrice.setText("FREE");
        } else {
            try {
                double p = Double.parseDouble(priceStr);
                previewBinding.tvPreviewPrice.setText(String.format("₹%,.0f", p));
            } catch (Exception e) {
                previewBinding.tvPreviewPrice.setText("₹" + priceStr);
            }
        }

        previewBinding.tvPreviewQuantity.setText("· " + binding.etQuantity.getText() + " " + binding.spUnit.getSelectedItem() + " available");
        previewBinding.tvPreviewMetadata.setText(binding.spCondition.getSelectedItem() + " · MOQ " + binding.etMinimumOrder.getText() + " · " + binding.spFulfillment.getSelectedItem());

        String desc = binding.etDescription.getText().toString();
        previewBinding.tvPreviewDescription.setText(desc.isEmpty() ? "Industrial ring frame machine in working condition. Recently refurbished. Available for immediate pickup." : desc);

        previewBinding.btnClosePreview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        dialog.show();
    }
}
