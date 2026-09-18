package com.reloop.organization.dashboard;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.reloopai.databinding.ActivityOrganizationDashboardBinding;
import com.reloop.organization.alerts.OrganizationAlertsActivity;
import com.reloop.organization.forecast.AIForecastActivity;
import com.reloop.organization.model.ForecastResult;
import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.model.OrgSummary;
import com.reloop.organization.profile.OrganizationProfileActivity;
import com.reloop.organization.recommendation.AIRecommendationActivity;
import com.reloop.organization.resource.ResourceDetailActivity;
import com.reloop.organization.resource.ResourceManagementActivity;
import com.reloop.organization.sustainability.SustainabilityOverviewActivity;

import java.util.List;

public class OrganizationDashboardActivity extends AppCompatActivity {

    private ActivityOrganizationDashboardBinding binding;
    private OrganizationDashboardViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOrganizationDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(OrganizationDashboardViewModel.class);

        setupObservers();
        setupClickListeners();

        viewModel.loadDashboardData();
    }

    private void setupObservers() {
        viewModel.getSummary().observe(this, new Observer<OrgSummary>() {
            @Override
            public void onChanged(OrgSummary summary) {
                if (summary == null) return;
                binding.tvSubHeaderDate.setText("Tuesday, 18 September • " + summary.getUnitName());
                binding.tvGreeting.setText("Good morning,\n" + summary.getUserName() + ".");

                binding.tvTotalResources.setText(String.valueOf(summary.getTotalResourcesTracked()));
                binding.tvAttentionCount.setText(summary.getResourcesNeedingAttention() + " need attention");

                binding.tvElectricityCapPercent.setText((int) summary.getMainResourcePercentageCap() + "%");
                binding.tvSurplusValue.setText(summary.getSurplusValueDisplay());
                binding.tvLiveListings.setText(summary.getLiveListingsCount() + " live listings");

                binding.tvStatTracked.setText(summary.getTotalResourcesTracked() + " TRACKED");
                binding.tvStatCritical.setText(summary.getCriticalResourcesCount() + " CRITICAL");
                binding.tvStatWarning.setText(summary.getWarningResourcesCount() + " WARNING");

                binding.tvStatListings.setText(summary.getLiveListingsCount() + " LISTINGS");
                binding.tvStatEnquiries.setText(summary.getEnquiriesCount() + " ENQUIRIES");
                binding.tvStatOffers.setText(summary.getOffersCount() + " OFFERS");
            }
        });

        viewModel.getForecast().observe(this, new Observer<ForecastResult>() {
            @Override
            public void onChanged(ForecastResult forecast) {
                if (forecast == null) return;
                binding.tvForecastTime.setText(forecast.getLastUpdated());
                binding.tvForecastHeadline.setText(forecast.getRecommendationSummary());
            }
        });

        viewModel.getHistory().observe(this, new Observer<List<HistoricalConsumption>>() {
            @Override
            public void onChanged(List<HistoricalConsumption> history) {
                if (history != null) {
                    binding.miniChartView.setData(history);
                }
            }
        });
    }

    private void setupClickListeners() {
        binding.ivNotification.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationDashboardActivity.this, OrganizationAlertsActivity.class));
            }
        });

        binding.ivProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationDashboardActivity.this, OrganizationProfileActivity.class));
            }
        });

        binding.btnModeRegular.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationDashboardActivity.this, "Contract: Regular User Module owned by User Team", Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnModeRRR.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationDashboardActivity.this, "Contract: RRR Module owned by Repair & Recycling Team", Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnViewRecommendation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationDashboardActivity.this, AIRecommendationActivity.class));
            }
        });

        binding.btnViewResourceDetail.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(OrganizationDashboardActivity.this, ResourceDetailActivity.class);
                intent.putExtra("EXTRA_RESOURCE_ID", "res_1");
                startActivity(intent);
            }
        });

        binding.cardResourceManagementEntry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationDashboardActivity.this, ResourceManagementActivity.class));
            }
        });

        binding.cardBulkMarketplaceEntry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationDashboardActivity.this, com.reloop.organization.marketplace.OrganizationSurplusMarketplaceActivity.class));
            }
        });

        binding.actionLaptops.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationDashboardActivity.this, "Action: Finding reuse opportunities for 8 laptops", Toast.LENGTH_SHORT).show();
            }
        });

        binding.actionFurniture.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationDashboardActivity.this, "Action: Repairing/redistributing 12 office furniture items", Toast.LENGTH_SHORT).show();
            }
        });

        binding.actionPackaging.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(OrganizationDashboardActivity.this, "Action: Finding recycling orgs for 320kg packaging material", Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnQuickSustainability.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationDashboardActivity.this, SustainabilityOverviewActivity.class));
            }
        });

        binding.btnQuickAlerts.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OrganizationDashboardActivity.this, OrganizationAlertsActivity.class));
            }
        });
    }
}
