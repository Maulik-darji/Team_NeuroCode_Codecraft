package com.reloop.organization.profile;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.reloopai.databinding.ActivityOrganizationProfileBinding;
import com.reloop.organization.alerts.OrganizationAlertsActivity;
import com.reloop.organization.goals.TargetThresholdActivity;
import com.reloop.organization.model.OrgProfile;

public class OrganizationProfileActivity extends AppCompatActivity {

    private ActivityOrganizationProfileBinding binding;
    private OrganizationProfileViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOrganizationProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(OrganizationProfileViewModel.class);

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        viewModel.getProfile().observe(this, new Observer<OrgProfile>() {
            @Override
            public void onChanged(OrgProfile profile) {
                if (profile == null) return;
                binding.tvOrgName.setText(profile.getOrganizationName());
                binding.tvUnitName.setText(profile.getUnitName());
                binding.tvOrgType.setText(profile.getOrgType());
                binding.tvVerification.setText(profile.getVerificationStatus());

                binding.tvContactPerson.setText("Primary Contact: " + profile.getContactPerson());
                binding.tvEmail.setText(profile.getEmail());
                binding.tvLocation.setText(profile.getLocation());
            }
        });

        binding.rowResourceGoals.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationProfileActivity.this, TargetThresholdActivity.class));
            }
        });

        binding.rowAlertSettings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationProfileActivity.this, OrganizationAlertsActivity.class));
            }
        });

        binding.rowAccountContract.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationProfileActivity.this, "Global Auth Contract: Owned by Auth Team", Toast.LENGTH_SHORT).show();
            }
        });

        viewModel.loadProfile();
    }
}
