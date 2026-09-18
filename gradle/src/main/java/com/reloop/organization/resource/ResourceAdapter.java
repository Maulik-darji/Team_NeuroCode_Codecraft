package com.reloop.organization.resource;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.R;
import com.example.reloopai.databinding.ItemOrgResourceBinding;
import com.reloop.organization.model.TrackedResource;

import java.util.List;

public class ResourceAdapter extends RecyclerView.Adapter<ResourceAdapter.ResourceViewHolder> {

    public interface OnResourceClickListener {
        void onResourceClick(TrackedResource resource);
    }

    private final List<TrackedResource> resourceList;
    private final OnResourceClickListener listener;

    public ResourceAdapter(List<TrackedResource> resourceList, OnResourceClickListener listener) {
        this.resourceList = resourceList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ResourceViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrgResourceBinding binding = ItemOrgResourceBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new ResourceViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ResourceViewHolder holder, int position) {
        holder.bind(resourceList.get(position), listener);
    }

    @Override
    public int getItemCount() {
        return resourceList.size();
    }

    static class ResourceViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrgResourceBinding binding;

        public ResourceViewHolder(ItemOrgResourceBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final TrackedResource resource, final OnResourceClickListener listener) {
            binding.tvResourceName.setText(resource.getName());
            binding.tvDepartment.setText(resource.getDepartment());
            binding.tvCurrentConsumption.setText(String.format("%,.0f %s", resource.getCurrentConsumption(), resource.getUnit()));
            binding.tvLimit.setText(String.format("of %,.0f cap", resource.getLimit()));
            binding.tvPercentage.setText(resource.getUsagePercentage() + "% consumed · target marker at " + (int) resource.getWarningThresholdPercent() + "%");

            binding.pbResourceUsage.setProgress(resource.getUsagePercentage());

            binding.tvResourceStatus.setText(resource.getStatus());
            if ("CRITICAL".equalsIgnoreCase(resource.getStatus()) || "EXCEEDED".equalsIgnoreCase(resource.getStatus())) {
                binding.tvResourceStatus.setBackgroundResource(R.drawable.bg_org_badge_critical);
                binding.tvResourceStatus.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_critical_red));
                binding.pbResourceUsage.setProgressTintList(ContextCompat.getColorStateList(itemView.getContext(), R.color.org_critical_red));
            } else if ("WARNING".equalsIgnoreCase(resource.getStatus())) {
                binding.tvResourceStatus.setBackgroundResource(R.drawable.bg_org_badge_warning);
                binding.tvResourceStatus.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_warning_amber));
                binding.pbResourceUsage.setProgressTintList(ContextCompat.getColorStateList(itemView.getContext(), R.color.org_warning_amber));
            } else {
                binding.tvResourceStatus.setBackgroundResource(R.drawable.bg_org_badge_normal);
                binding.tvResourceStatus.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_primary_forest));
                binding.pbResourceUsage.setProgressTintList(ContextCompat.getColorStateList(itemView.getContext(), R.color.org_primary_forest));
            }

            if (resource.getTrendChangePercent() > 0) {
                binding.tvTrend.setText(String.format("▲ %.1f%% vs last month", resource.getTrendChangePercent()));
            } else {
                binding.tvTrend.setText(String.format("▼ %.1f%% vs last month", Math.abs(resource.getTrendChangePercent())));
            }

            binding.tvForecastBrief.setText(String.format("Est %,.0f %s", resource.getPredictedConsumption(), resource.getUnit()));

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) listener.onResourceClick(resource);
                }
            });
        }
    }
}
